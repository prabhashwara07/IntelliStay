"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountries = void 0;
const Location_1 = __importDefault(require("../infrastructure/entities/Location"));
const getCountries = async (req, res, next) => {
    try {
        const countries = await Location_1.default.distinct("country");
        countries.sort((a, b) => a.localeCompare(b));
        res.status(200).json(countries);
    }
    catch (error) {
        next(error);
    }
};
exports.getCountries = getCountries;
//# sourceMappingURL=location.js.map