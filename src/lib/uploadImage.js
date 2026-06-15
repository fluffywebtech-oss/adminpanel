import { supabase } from './supabase'

const BUCKET = 'property-images'

/**
 * Upload an image File to Supabase Storage and return its public URL.
 * Falls back to a base64 data URL if Storage isn't available (e.g. bucket
 * not created yet), so uploads never hard-fail.
 */
export async function uploadImage(file) {
  if (!supabase) return await toDataUrl(file)
  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    })
    if (error) {
      console.warn('[uploadImage] Storage upload failed, using data URL fallback:', error.message)
      return await toDataUrl(file)
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  } catch (e) {
    console.warn('[uploadImage] exception, using data URL fallback:', e.message)
    return await toDataUrl(file)
  }
}

function toDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}
