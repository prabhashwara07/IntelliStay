"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amenity = void 0;
const mongoose_1 = require("mongoose");
const amenitySchema = new mongoose_1.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
exports.Amenity = (0, mongoose_1.model)('Amenity', amenitySchema);
//# sourceMappingURL=Amenity.js.map