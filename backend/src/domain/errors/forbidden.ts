export class ForbiddenError extends Error {
    code: number;

    constructor(message: string = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
        this.code = 403;
    }
}
