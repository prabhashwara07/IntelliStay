import { Router } from 'express';
import { isAuthenticated, requireRole, ROLES } from './middleware/authHandler';
import { approveHotelRequest, getHotelRequests, rejectHotelRequest,  } from '../application/admin';

const AdminRouter = Router();

AdminRouter.get('/hotel-requests',isAuthenticated, requireRole([ROLES.ADMIN]), getHotelRequests);
AdminRouter.put('/approve/:id', isAuthenticated, requireRole([ROLES.ADMIN]), approveHotelRequest);
AdminRouter.put('/reject/:id', isAuthenticated, requireRole([ROLES.ADMIN]), rejectHotelRequest);


export default AdminRouter;
