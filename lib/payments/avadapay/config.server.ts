import "server-only";

export type AvadaPayServerConfig = {
  apiUrl: string;
  publicId: string;
  merchantId: string;
  secretKey: string;
};

export function getAvadaPayServerConfig(): AvadaPayServerConfig {
  const apiUrl = process.env.AVADAPAY_API_URL;
  const publicId = process.env.AVADAPAY_PUBLIC_ID;
  const merchantId = process.env.AVADAPAY_MERCHANT_ID;
  const secretKey = process.env.AVADAPAY_SECRET_KEY;

  if (!apiUrl || !publicId || !merchantId || !secretKey) {
    throw new Error("Configuration serveur AvadaPay incomplète.");
  }

  return { apiUrl, publicId, merchantId, secretKey };
}
