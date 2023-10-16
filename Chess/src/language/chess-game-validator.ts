import type { ValidationChecks } from 'langium';
import type { ChessGameAstType } from './generated/ast.js';
import type { ChessGameServices } from './chess-game-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ChessGameServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ChessGameValidator;
    const checks: ValidationChecks<ChessGameAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ChessGameValidator {
/*
    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }*/

}
