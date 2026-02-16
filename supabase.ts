
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtfhdxdgtahphhepaqeo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0qttxCHGusO_xI_wjDsFyQ_IT_sGE8c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Uploads a file to Supabase storage.
 * Paths should be unique to avoid overwriting issues.
 */
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true
  });

  if (error) {
    throw error;
  }
  
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
};

/**
 * Generates a high-entropy 12-character Registration Number
 * Format: MPC26 + 4 digits of timestamp + 3 random digits
 */
export const generateRegistrationNumber = () => {
  const timestampPart = Date.now().toString().slice(-4);
  const randomPart = Math.floor(100 + Math.random() * 899);
  return `MPC26${timestampPart}${randomPart}`;
};
