export class NotFoundError extends Error {

    code: number;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.code = 404;
    }
}
