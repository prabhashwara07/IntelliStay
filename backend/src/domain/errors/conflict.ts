export class ConflictError extends Error {
    code: number;

    constructor(message: string = 'Conflict') {
        super(message);
        this.name = 'ConflictError';
        this.code = 409;
    }
}
