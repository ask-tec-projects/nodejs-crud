export class Cookie {
    public static parse(cookie_string: string): Record<string, string> {
        return cookie_string.split(";")
            .map(cookie => cookie.split("="))
            .reduce((dict: Record<string, string>, component) => {
                dict[decodeURIComponent(component[0].trim())] = decodeURIComponent(component[1].trim());
                return dict;
            }, {});
    }
}
