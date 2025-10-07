"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_1 = require("../application/location");
const LocationRouter = express_1.default.Router();
LocationRouter.get('/countries', location_1.getCountries);
exports.default = LocationRouter;
//# sourceMappingURL=location.js.map