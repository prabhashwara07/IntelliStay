import crypto from 'crypto';

export const generateHash = (ordersId: string, amounts: string) => {
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "";
  const orderId = ordersId;
  const amount = amounts;
  
  // Using Node.js native crypto module instead of crypto-js
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();
  
  // Format amount to 2 decimal places
  const amountFormatted = parseFloat(amount).toFixed(2);
  
  const currency = "LKR";
  
  // Generate final hash
  const hash = crypto
    .createHash('md5')
    .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
    .digest('hex')
    .toUpperCase();
  
  return hash;
}

export default generateHash;