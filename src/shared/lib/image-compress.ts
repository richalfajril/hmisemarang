// Client-side image optimizer: convert any raster image to WebP and shrink it
// for the web before upload. Uses the browser Canvas API — no dependency.
//
// Strategy (best practice): resize to a sensible max edge, encode WebP at a
// high-but-efficient quality, and if still over the size ceiling prefer
// DOWNSCALING over dropping quality (downscale keeps images sharp; very low
// quality introduces visible artifacts). Quality floor stays at 0.6.

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB hard ceiling (safety; output is usually far smaller)
const DEFAULT_MAX_DIMENSION = 1920 // longest edge for full-width imagery
const MIN_DIMENSION = 640 // don't downscale below this; drop quality instead
const BASE_QUALITY = 0.82 // sweet spot — near-indistinguishable, much smaller than 0.9
const MIN_QUALITY = 0.6 // floor — below this artifacts get visible

/**
 * Returns a web-optimized WebP `File`. Re-encodes even small non-WebP images.
 * Inputs that are already WebP, non-raster (SVG/GIF), or fail to decode are
 * passed through untouched (no compress/convert pipeline).
 *
 * @param file source image
 * @param maxDimension longest-edge cap in px (e.g. 1920 hero, 1280 content, 512 logo)
 */
export async function compressImageToWebp(
  file: File,
  maxDimension: number = DEFAULT_MAX_DIMENSION
): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/webp" || // sudah WebP → langsung upload, lewati pipeline
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    // imageOrientation: apply EXIF rotation (phone photos) so output isn't sideways.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // can't decode → upload as-is
  }

  let width = bitmap.width;
  let height = bitmap.height;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const draw = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    return canvas;
  };

  const toBlob = (canvas: HTMLCanvasElement, q: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", q));

  let quality = BASE_QUALITY;
  let canvas = draw(width, height);
  if (!canvas) return file;
  let blob = await toBlob(canvas, quality);

  // ponytail: bounded loop, ceiling 2MB. Downscale first (keeps sharpness);
  // only drop quality once we hit MIN_DIMENSION. Max ~16 tries — heuristic.
  let guard = 0;
  while (blob && blob.size > MAX_BYTES && guard < 16) {
    guard++;
    if (Math.max(width, height) > MIN_DIMENSION) {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      const next = draw(width, height);
      if (!next) break;
      canvas = next;
    } else if (quality > MIN_QUALITY) {
      quality = Math.round((quality - 0.1) * 10) / 10;
    } else {
      break; // smallest sensible size + lowest acceptable quality reached
    }
    blob = await toBlob(canvas, quality);
  }

  bitmap.close?.();
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
