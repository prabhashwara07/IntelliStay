import md5 from "crypto-js/md5";

export default function generateHash(ordersId, amounts) {
  let merchantSecret  = "MTE0Njg3MTc2MjE0NDM4MDcwNTAxMzc2MzAzODExMzEzMzMxOTc1";
  let merchantId      = "1229354";
  let orderId         = ordersId;
  let amount          = amounts;

  let hashedSecret    = md5(merchantSecret).toString().toUpperCase();
  let amountFormatted = parseFloat(amount)
                          .toLocaleString("en-US", { minimumFractionDigits: 2 })
                          .replaceAll(",", "");
  let currency        = "LKR";

  let hash = md5(merchantId + orderId + amountFormatted + currency + hashedSecret)
              .toString()
              .toUpperCase();

  return (
    hash
  );
}
