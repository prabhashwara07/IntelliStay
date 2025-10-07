"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateHash = (ordersId, amounts) => {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
    const merchantId = process.env.PAYHERE_MERCHANT_ID || "";
    const orderId = ordersId;
    const amount = amounts;
    // Using Node.js native crypto module instead of crypto-js
    const hashedSecret = crypto_1.default
        .createHash('md5')
        .update(merchantSecret)
        .digest('hex')
        .toUpperCase();
    // Format amount to 2 decimal places
    const amountFormatted = parseFloat(amount).toFixed(2);
    const currency = "LKR";
    // Generate final hash
    const hash = crypto_1.default
        .createHash('md5')
        .update(merchantId + orderId + amountFormatted + currency + hashedSecret)
        .digest('hex')
        .toUpperCase();
    return hash;
};
exports.generateHash = generateHash;
exports.default = exports.generateHash;
//# sourceMappingURL=payhere.js.map