export class InternalServerError extends Error {
    code: number;

    constructor(message: string = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
        this.code = 500;
    }
}
