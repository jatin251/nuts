// https://pqina.nl/blog/compress-image-before-upload/

export const compressImage = async (
  file: File,
  { quality = 1, type = file.type }
): Promise<Blob | null> => {
  // Get as image data
  const imageBitmap = await createImageBitmap(file);

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0);

  // Turn into Blob
  return await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
};
