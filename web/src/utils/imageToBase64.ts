/**
 * Convierte una imagen en Base64 para poder usarla en jsPDF.
 * @param url Ruta de la imagen (ejemplo: "/logo5.png" en carpeta public).
 * @returns Promise<string> con el contenido Base64.
 */
export const imageToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};