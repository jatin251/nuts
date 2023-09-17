/** Turns a Blob into a file. */
export const blobToFile = (blob: Blob, fileName: string): File => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b: any = blob;

  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  //Cast to a File() type
  return blob as File;
};

// https://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript
