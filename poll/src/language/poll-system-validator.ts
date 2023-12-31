import type { ValidationChecks } from 'langium';
import type { PollSystemAstType } from './generated/ast.js';
import type { PollSystemServices } from './poll-system-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: PollSystemServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.PollSystemValidator;
    const checks: ValidationChecks<PollSystemAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class PollSystemValidator {

    /*  checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    } */

}
