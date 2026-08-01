import supabaseAdmin from '@/lib/supabaseAdmin';

export const AUDIO_BUCKET = 'audio';

export async function uploadAudioFile(file: File): Promise<string> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(AUDIO_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type || 'audio/mpeg',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(AUDIO_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteAudioFile(audioUrl: string | null | undefined) {
  if (!audioUrl) return;

  const marker = `/storage/v1/object/public/${AUDIO_BUCKET}/`;
  const markerIndex = audioUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const objectKey = audioUrl.slice(markerIndex + marker.length);
  await supabaseAdmin.storage.from(AUDIO_BUCKET).remove([objectKey]);
}
