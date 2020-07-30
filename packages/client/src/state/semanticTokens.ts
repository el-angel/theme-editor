import { atom, selector } from 'recoil';

import { rawCode } from '~/state/code';

import API from '~/services/api';

import { EntityType } from '~/constants';

import { atomKey, selectorKey } from '~/helpers/state';
import factory from '~/helpers/tokenStateFactory';

import { SemanticToken } from '~/types';

export enum States {
    Active,
    Enabled,
    Inactive,
    Loading,
}

export const semanticState = atom<States>({
    key: atomKey('semanticTokens', 'State'),
    default: States.Inactive,
});

export const semanticTokens = selector({
    key: selectorKey('semanticTokens', 'Tokens'),
    get: async ({ get }) => {
        const state = get(semanticState);

        if (state !== States.Active) {
            return;
        }

        const code = get(rawCode);

        const result = await API.getSemanticTokens({
            code,
            language: 'tsx',
        });

        return result;
    },
});

const {
    TREE_ID: SEMANTIC_STATE_ID,
    getEntities: getSemanticTokens,
    getEntity: getSemanticToken,
    entityIds: getSemanticTokenIds,
} = factory({
    state: 'semantic',
    default: <SemanticToken>{
        id: '',
        scope: '',
        settings: {
            foreground: '#000000',
            fontStyle: [],
        },
        __meta: {
            type: EntityType.SemanticToken,
        },
    },
});

export { SEMANTIC_STATE_ID, getSemanticTokens, getSemanticToken, getSemanticTokenIds };
