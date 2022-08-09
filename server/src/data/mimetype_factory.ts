import { UnknownMimetypeError } from "./error/unknown_mimetype";
import { MimeType } from "./mimetype";

export class MimeTypeFactory {
    protected static readonly lookuptable: Record<string, MimeType> = {
        "js": MimeType.JAVASCRIPT,
        "html": MimeType.HTML,
        "htm": MimeType.HTML,
        "css": MimeType.CSS,
    }
    public from_extension(extension: string): MimeType {
        const mimetype = MimeTypeFactory.lookuptable[extension]
        if (mimetype === undefined) {
            throw new UnknownMimetypeError(`Unknown mimetype for ${extension}`);
        }
        return mimetype;
    }
}
