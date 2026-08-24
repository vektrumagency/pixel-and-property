function isAbsolute(publicId: string): boolean {
  return publicId.startsWith("https://") || publicId.startsWith("http://");
}

export function cldUrl(
  publicId: string,
  opts: { w?: number; q?: number } = {}
): string {
  if (isAbsolute(publicId)) {
    return publicId;
  }
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const w = opts.w ?? 1600;
  const q = opts.q ?? 80;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},q_${q},f_auto/${publicId}`;
}

export function cldVideoUrl(
  publicId: string,
  opts: { w?: number; q?: number } = {}
): string {
  if (isAbsolute(publicId)) {
    return publicId;
  }
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const w = opts.w ?? 1600;
  const q = opts.q ?? 80;
  return `https://res.cloudinary.com/${cloud}/video/upload/w_${w},q_${q}/${publicId}`;
}

export function cldVideoThumb(
  publicId: string,
  opts: { w?: number } = {}
): string {
  if (isAbsolute(publicId)) {
    return publicId;
  }
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const w = opts.w ?? 800;
  return `https://res.cloudinary.com/${cloud}/video/upload/w_${w},q_80,so_0/${publicId}.jpg`;
}
