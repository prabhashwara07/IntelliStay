"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const database_1 = __importDefault(require("./infrastructure/database"));
const errorHandler_1 = __importDefault(require("./api/middleware/errorHandler"));
const hotel_1 = __importDefault(require("./api/hotel"));
const location_1 = __importDefault(require("./api/location"));
const billingProfile_1 = __importDefault(require("./api/billingProfile"));
const booking_1 = __importDefault(require("./api/booking"));
const admin_1 = __importDefault(require("./api/admin"));
// Load environment variables first
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Add this for PayHere form data
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use((0, express_2.clerkMiddleware)());
app.use("/hotels", hotel_1.default);
app.use("/locations", location_1.default);
app.use("/billing-profile", billingProfile_1.default);
app.use("/bookings", booking_1.default);
app.use("/admin", admin_1.default);
app.use(errorHandler_1.default);
const PORT = process.env.PORT || 3000;
(0, database_1.default)();
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map