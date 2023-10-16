import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
import { PollSystemGeneratedModule, PollSystemGeneratedSharedModule } from './generated/module.js';
import { PollSystemValidator, registerValidationChecks } from './poll-system-validator.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type PollSystemAddedServices = {
    validation: {
        PollSystemValidator: PollSystemValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type PollSystemServices = LangiumServices & PollSystemAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const PollSystemModule: Module<PollSystemServices, PartialLangiumServices & PollSystemAddedServices> = {
    validation: {
        PollSystemValidator: () => new PollSystemValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createPollSystemServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    PollSystem: PollSystemServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        PollSystemGeneratedSharedModule
    );
    const PollSystem = inject(
        createDefaultModule({ shared }),
        PollSystemGeneratedModule,
        PollSystemModule
    );
    shared.ServiceRegistry.register(PollSystem);
    registerValidationChecks(PollSystem);
    return { shared, PollSystem };
}
