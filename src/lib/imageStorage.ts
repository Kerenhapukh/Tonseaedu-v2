import supabaseAdmin from '@/lib/supabaseAdmin';

export const MATERI_IMAGE_BUCKET = 'materi-images';

export async function uploadMateriImage(file: File): Promise<string> {
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(MATERI_IMAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabaseAdmin.storage.from(MATERI_IMAGE_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function deleteMateriImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  const marker = `/storage/v1/object/public/${MATERI_IMAGE_BUCKET}/`;
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const objectKey = imageUrl.slice(markerIndex + marker.length);
  await supabaseAdmin.storage.from(MATERI_IMAGE_BUCKET).remove([objectKey]);
}
