import { EnvironmentValidator } from "./environment_validator";

export class ServerEnvironmentValidator extends EnvironmentValidator {
    protected required_variables: string[] = ["DB_PATH", "SERVER_PORT"];
}
