import { InvalidEnvironmentError } from "../data/error/invalid_environment";

export abstract class EnvironmentValidator {
    protected abstract required_variables: string[];
    private readonly environment: string[];

    public constructor() {
        this.environment = Object.keys(process.env);
    }

    public validate_environment(): void {
        for (const varname of this.required_variables) {
            this.throw_invalid_environment_error_if_variable_missing(varname);
        }
        console.log(`${this.constructor.name} validated environment`);
    }

    private throw_invalid_environment_error_if_variable_missing(varname: string) {
        if (!this.environment.includes(varname)) {
            throw new InvalidEnvironmentError(`Missing environment variable: ${varname}`);
        }
    }
}
