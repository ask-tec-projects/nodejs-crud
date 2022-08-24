import { UUIDv4 } from "./uuidv4";

export class Session {
    protected static instance: Session | undefined;
    protected readonly sessions: Record<string, string>;

    protected constructor() {
        this.sessions = {};
    }

    public static get(): Session {
        if (this.instance === undefined) {
            this.instance = new Session();
        }
        return this.instance;
    }

    public add(email: string | undefined): void {
        if (email === undefined) {
            return;
        }
        const session_id = UUIDv4.generate().toString();
        this.sessions[email] = session_id;
        console.log(`Assigned new session to ${email}`);
    }

    public user_to_session(user_id: string | UUIDv4): UUIDv4 {
        return new UUIDv4(this.sessions[user_id.toString()]);
    }

    public session_to_user(id: string | UUIDv4): UUIDv4 | undefined {
        return new UUIDv4(Object.values(this.sessions).find((next_id) => next_id === id))
    }

    public is_valid(id: string | UUIDv4): boolean {
        return this.session_to_user(id) !== undefined;
    }
}
