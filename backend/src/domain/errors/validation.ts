export class ValidationError extends Error {
    code: number;
    errors?: string[];

    constructor(message: string = 'Validation Error', errors?: string[]) {
        super(message);
        this.name = 'ValidationError';
        this.code = 422;
        this.errors = errors;
    }
}
