"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billingProfile_1 = require("../application/billingProfile");
const authHandler_1 = __importDefault(require("./middleware/authHandler"));
const router = express_1.default.Router();
router.post("/", authHandler_1.default, billingProfile_1.createOrUpdateBillingProfile);
router.get("/:userId", authHandler_1.default, billingProfile_1.getBillingProfileByUserId);
exports.default = router;
//# sourceMappingURL=billingProfile.js.map