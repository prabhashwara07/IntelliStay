"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});
const Location = (0, mongoose_1.model)("Location", locationSchema);
exports.default = Location;
//# sourceMappingURL=Location.js.map