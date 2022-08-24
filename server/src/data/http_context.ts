import { Serializable } from "worker_threads";
import { MimeType } from "./mimetype";

export interface HTTPResponseContext {
    data: string;
    mimetype: MimeType;
    status_code: number;
    headers?: Record<string, string>;
}
