import type { ValidationChecks } from 'langium';
import type { VideoGeneratorAstType } from './generated/ast.js';
import type { VideoGeneratorServices } from './video-generator-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: VideoGeneratorServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.VideoGeneratorValidator;
    const checks: ValidationChecks<VideoGeneratorAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class VideoGeneratorValidator {

   

}
