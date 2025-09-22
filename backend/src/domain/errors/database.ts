export class DatabaseError extends Error {
    code: number;
    operation?: string;

    constructor(message: string = 'Database Error', operation?: string) {
        super(message);
        this.name = 'DatabaseError';
        this.code = 500;
        this.operation = operation;
    }
}
