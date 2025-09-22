export class BadRequestError extends Error {
    code: number;

    constructor(message: string = 'Bad Request') {
        super(message);
        this.name = 'BadRequestError';
        this.code = 400;
    }
}
