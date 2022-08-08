import { ServerResponse } from "http";

export abstract class HTTPError extends Error {
    public abstract readonly name: string;
    public abstract readonly status_code: number;
    public abstract readonly status_text: string;
}
