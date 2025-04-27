export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => {
      console.log(`Error loading image: ${url}`);
      resolve(false);
    };
  });
};
