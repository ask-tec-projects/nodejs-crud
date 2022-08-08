import { IncomingMessage, OutgoingMessage } from "http";

export abstract class BodyReader<OutputType> {
    public read(request: IncomingMessage): Promise<OutputType> {
        return new Promise((resolve) => {
            let body = "";
            request.on("readable", () => body += request.read());
            request.on("end", () => resolve(this.postprocess(body)));
        });
    }

    protected abstract postprocess(body: string): OutputType;
}
