import { EntityType } from '~/constants';

import { GeneralScope, Rule, SemanticToken } from '~/types';

export function isGeneralScope(input: any): input is GeneralScope {
    return input.__meta.type === EntityType.GeneralScope;
}

export function isRule(input: any): input is Rule {
    return input.__meta.type === EntityType.Rule;
}

export function isSemanticToken(input: any): input is SemanticToken {
    return input.__meta.type === EntityType.SemanticToken;
}
