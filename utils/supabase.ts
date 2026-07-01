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

export async function deleteFromSupabase(imageUrl: string): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const bucketName = process.env.SUPABASE_BUCKET || 'levels';

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Key not configured. Skipping image deletion.');
    return;
  }

  try {
    // Extract filename from the URL (the last part of the path)
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    if (!filename) return;

    const baseSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
    const deleteUrl = `${baseSupabaseUrl}/storage/v1/object/${bucketName}/${filename}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to delete file from Supabase: ${response.statusText} - ${errorText}`);
    } else {
      console.log(`Successfully deleted file from Supabase: ${filename}`);
    }
  } catch (error) {
    console.error('Error during Supabase file deletion:', error);
  }
}
