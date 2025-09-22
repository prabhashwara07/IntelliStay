export { BadRequestError } from './bad-request';
export { UnauthorizedError } from './unauthorized';
export { ForbiddenError } from './forbidden';
export { NotFoundError } from './not-found';
export { ConflictError } from './conflict';
export { ValidationError } from './validation';
export { InternalServerError } from './internal-server';
export { DatabaseError } from './database';

// Base error interface for consistency
export interface ApiError {
    name: string;
    message: string;
    code: number;
}
