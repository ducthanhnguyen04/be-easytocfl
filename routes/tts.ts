import { Router, Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// Local in-memory cache to store filenames of successfully cached files
// This prevents hitting Supabase over the network for validation on every request (0ms latency cache hit)
const localTtsCache = new Set<string>();

const getHash = (text: string) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

async function uploadTtsToSupabase(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const bucketName = process.env.SUPABASE_AUDIO_BUCKET || 'audio-vocab-easytocfl';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be configured.');
  }

  const baseSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  const uploadUrl = `${baseSupabaseUrl}/storage/v1/object/${bucketName}/${fileName}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': mimeType,
      'cache-control': 'max-age=31536000' // Instruct browser to cache this audio locally for 1 year
    },
    body: fileBuffer as any,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase upload failed: ${response.statusText} - ${errorText}`);
  }

  return `${baseSupabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;
}

router.get('/pronounce', async (req: Request, res: Response): Promise<any> => {
  try {
    const text = req.query.text as string;
    if (!text) {
      return res.status(400).json({ message: 'Text query parameter is required.' });
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION || 'southeastasia';
    const bucketName = process.env.SUPABASE_AUDIO_BUCKET || 'audio-vocab-easytocfl';

    const hash = getHash(text.trim());
    
    // Use azure or google suffix for cache differentiation
    const prefix = speechKey ? 'tts_azure' : 'tts_google';
    const fileName = `${prefix}_${hash}.mp3`;

    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
      return res.status(500).json({ message: 'Supabase URL is not configured.' });
    }

    const baseSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    const publicUrl = `${baseSupabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`;

    // 1. Check local in-memory cache first (0ms latency check)
    if (localTtsCache.has(fileName)) {
      return res.redirect(publicUrl);
    }

    // 2. Check if the file already exists in Supabase Storage using a HEAD request
    try {
      const checkResponse = await fetch(publicUrl, { method: 'HEAD' });
      if (checkResponse.ok) {
        // File exists, save to memory cache and redirect directly
        localTtsCache.add(fileName);
        return res.redirect(publicUrl);
      }
    } catch (checkErr) {
      console.warn("HEAD check failed, continuing to generate:", checkErr);
    }

    // 3. If Azure Key is not configured, generate via Google Translate TTS (at backend) and cache it
    if (!speechKey) {
      console.info("AZURE_SPEECH_KEY not set. Generating Google Translate TTS audio & caching to Supabase in the background.");
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-TW&client=tw-ob&q=${encodeURIComponent(text)}`;
      
      const googleResponse = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
        }
      });
      
      if (!googleResponse.ok) {
        throw new Error(`Google Translate TTS request failed: ${googleResponse.statusText}`);
      }
      
      const audioBuffer = Buffer.from(await googleResponse.arrayBuffer());
      
      // Stream audio buffer immediately to the browser (extremely fast response!)
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);

      // Perform Supabase upload in the background (fire-and-forget)
      uploadTtsToSupabase(audioBuffer, fileName, 'audio/mpeg')
        .then(() => {
          localTtsCache.add(fileName);
          console.info(`Successfully cached Google TTS for text in background: "${text}"`);
        })
        .catch(err => {
          console.error(`Background Google TTS upload failed for text "${text}":`, err);
        });
      
      return;
    }

    // 4. Generate Audio using Microsoft Azure Cognitive Speech Service API
    const tokenUrl = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey
      }
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to issue Azure Speech token: ${tokenResponse.statusText}`);
    }
    const accessToken = await tokenResponse.text();

    const ttsUrl = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `<speak version='1.0' xml:lang='zh-TW'><voice xml:lang='zh-TW' xml:gender='Female' name='zh-TW-HsiaoChenNeural'>${text}</voice></speak>`;

    const ttsResponse = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'easy-tocfl'
      },
      body: ssml
    });

    if (!ttsResponse.ok) {
      throw new Error(`Azure TTS generation failed: ${ttsResponse.statusText}`);
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer());

    // Stream audio buffer immediately to the browser
    res.set('Content-Type', 'audio/mpeg');
    res.send(audioBuffer);

    // Perform Supabase upload in the background (fire-and-forget)
    uploadTtsToSupabase(audioBuffer, fileName, 'audio/mpeg')
      .then(() => {
        localTtsCache.add(fileName);
        console.info(`Successfully cached Azure TTS for text in background: "${text}"`);
      })
      .catch(err => {
        console.error(`Background Azure TTS upload failed for text "${text}":`, err);
      });

    return;

  } catch (error) {
    console.error("TTS dynamic generate error:", error);
    // Ultimate fallback: if upload or cloud API fails, stream the Google Translate audio directly
    // to bypass browser referer restrictions entirely!
    try {
      const text = req.query.text as string;
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=zh-TW&client=tw-ob&q=${encodeURIComponent(text)}`;
      const googleResponse = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36'
        }
      });
      if (googleResponse.ok) {
        const audioBuffer = Buffer.from(await googleResponse.arrayBuffer());
        res.set('Content-Type', 'audio/mpeg');
        return res.send(audioBuffer);
      }
    } catch (streamErr) {
      console.error("Stream fallback failed:", streamErr);
    }
    return res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
