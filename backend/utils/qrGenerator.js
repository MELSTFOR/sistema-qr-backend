import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    const qrImage = await QRCode.toDataURL(JSON.stringify(data));
    return qrImage; // Devuelve una URL base64
  } catch (error) {
    console.error("Error generando QR:", error);
    throw error;
  }
};
