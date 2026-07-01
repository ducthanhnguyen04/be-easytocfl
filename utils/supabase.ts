import dotenv from 'dotenv';
dotenv.config();

export async function uploadToSupabase(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const bucketName = process.env.SUPABASE_BUCKET || 'levels';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be configured in environment variables.');
  }

  // Clean the Supabase URL in case it has trailing slashes or /rest/v1 path
  const baseSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  // Generate a unique filename using timestamp
  const sanitizedFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const uploadUrl = `${baseSupabaseUrl}/storage/v1/object/${bucketName}/${sanitizedFileName}`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': mimeType,
    },
    body: fileBuffer as any,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase upload failed: ${response.statusText} - ${errorText}`);
  }

  // Return the public URL for the uploaded asset
  return `${baseSupabaseUrl}/storage/v1/object/public/${bucketName}/${sanitizedFileName}`;
}
