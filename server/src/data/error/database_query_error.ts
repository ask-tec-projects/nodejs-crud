export class DatabaseQueryError extends Error {
    public name = "DatabaseQueryError";

    public constructor(message: string, cause: string) {
        super(`${message} ${cause}`);
    }
}
