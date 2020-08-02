import { uniqueId } from 'lodash';

import { createQuerySelector } from '~/services/semanticToken';

import { EntityType } from '~/constants';

import { SemanticToken } from '~/types';

interface Options {
    existingIds: string[];
}

const createSemanticToken = (
    input: Partial<SemanticToken>,
    options: Options,
): SemanticToken | undefined => {
    if (!input.scope) {
        throw new Error("Can't create token without a scope");
    }

    // check if the scope is valid using the registry
    createQuerySelector(input.scope);

    const { existingIds } = options;

    let id = uniqueId();

    while (existingIds.includes(id)) {
        id = uniqueId();
    }

    const token: SemanticToken = {
        id,
        scope: input.scope,
        settings: {
            foreground: input?.settings?.foreground || '#a0988a',
            fontStyle: input?.settings?.fontStyle || [],
        },
        __meta: {
            type: EntityType.SemanticToken,
        },
    };

    return token;
};

export default createSemanticToken;
