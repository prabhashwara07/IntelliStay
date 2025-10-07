"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userId: { type: String, required: true },
    hotelId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
}, {
    timestamps: true
});
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.default = Review;
//# sourceMappingURL=Review.js.map