import { SemanticToken as ExternalSemanticToken } from '@anche/semantic-tokens-utilities';
import { groupBy } from 'lodash';
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
    // default: States.Inactive,
    default: States.Active,
});

export const semanticTokens = selector({
    key: selectorKey('semanticTokens', 'Tokens'),
    get: async ({ get }) => {
        const state = get(semanticState);

        if (state !== States.Active) {
            return;
        }

        const code = get(rawCode);

        const result = await API.semanticTokensState({
            code,
            language: 'tsx',
        });

        const _grouped = groupBy(result?.tokens, 'line');

        const grouped: Record<number, Record<number, ExternalSemanticToken[]>> = {};

        Object.keys(_grouped).forEach(lineNumber => {
            grouped[lineNumber] = groupBy(_grouped[lineNumber], 'start');
        });

        return grouped;

        // return result;
    },
});

const {
    TREE_ID: SEMANTIC_STATE_ID,
    getEntities: semanticTokensState,
    getEntity: semanticTokenState,
    entityIds: semanticTokenIds,
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

export { SEMANTIC_STATE_ID, semanticTokensState, semanticTokenState, semanticTokenIds };
