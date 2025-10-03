import md5 from "crypto-js/md5";

export default function generateHash(ordersId, amounts) {
  let merchantSecret  = "MzA3ODIxMDkzNzEyNDM5OTMzMDI0MTM5MzIyNzQ2MTcwMjU5MTcy";
  let merchantId      = "1232279";
  let orderId         = ordersId;
  let amount          = amounts;

  let hashedSecret    = md5(merchantSecret).toString().toUpperCase();

  // --- THIS IS THE FIX ---
  // Use toFixed(2) to ensure two decimal places without thousand separators.
  let amountFormatted = parseFloat(amount).toFixed(2);
  // -----------------------
  
  let currency        = "LKR";

  let hash = md5(merchantId + orderId + amountFormatted + currency + hashedSecret)
              .toString()
              .toUpperCase();

  return (
    hash
  );
}