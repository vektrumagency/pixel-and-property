export function cldUrl(
  publicId: string,
  opts: { w?: number; q?: number } = {}
): string {
  if (publicId.startsWith("https://") || publicId.startsWith("http://")) {
    return publicId;
  }
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const w = opts.w ?? 1600;
  const q = opts.q ?? 80;
  return `https://res.cloudinary.com/${cloud}/image/upload/w_${w},q_${q},f_auto/${publicId}`;
}
