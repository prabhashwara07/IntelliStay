"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectHotelRequest = exports.approveHotelRequest = exports.getHotelRequests = void 0;
const Hotel_1 = __importDefault(require("../infrastructure/entities/Hotel"));
const errors_1 = require("../domain/errors");
const express_1 = require("@clerk/express");
const getHotelRequests = async (req, res, next) => {
    const HotelRequests = await Hotel_1.default.find({ status: 'pending' });
    res.status(200).json(HotelRequests);
};
exports.getHotelRequests = getHotelRequests;
const approveHotelRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel_1.default.findById(id);
        if (!hotel) {
            throw new errors_1.NotFoundError('Hotel not found');
        }
        if (hotel.status === 'approved') {
            throw new errors_1.BadRequestError('Hotel is already approved');
        }
        if (!hotel.ownerId) {
            throw new errors_1.BadRequestError('Hotel has no owner assigned');
        }
        // Promote owner to hotelowner in Clerk public metadata
        try {
            await express_1.clerkClient.users.updateUser(hotel.ownerId, {
                publicMetadata: { role: 'hotelowner' }
            });
        }
        catch (err) {
            throw new errors_1.InternalServerError('Failed to update owner role in Clerk');
        }
        // Update hotel status to approved
        hotel.status = 'approved';
        await hotel.save();
        res.status(200).json({
            success: true,
            message: 'Hotel request approved successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.approveHotelRequest = approveHotelRequest;
const rejectHotelRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel_1.default.findById(id);
        if (!hotel) {
            throw new errors_1.NotFoundError('Hotel not found');
        }
        if (hotel.status === 'rejected') {
            throw new errors_1.BadRequestError('Hotel is already approved');
        }
        // Update hotel status to approved
        hotel.status = 'rejected';
        await hotel.save();
        res.status(200).json({
            success: true,
            message: 'Hotel request rejected successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.rejectHotelRequest = rejectHotelRequest;
//# sourceMappingURL=admin.js.map