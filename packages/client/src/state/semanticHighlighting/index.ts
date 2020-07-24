import { atom, selector } from 'recoil';

import { rawCode } from '~/state/code';

import API from '~/services/api';

import { atomKey, selectorKey } from '~/helpers/state';

export enum States {
    Active,
    Enabled,
    Inactive,
    Loading,
}

export const semanticState = atom<States>({
    key: atomKey('SemanticHighlighting_State'),
    default: States.Inactive,
});

export const semanticTokens = selector({
    key: selectorKey('SemanticTokens'),
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
