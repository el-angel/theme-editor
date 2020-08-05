import { MutableSnapshot } from 'recoil';

import { generalScopeState } from '~/state/generalScopes';
import { ruleIds, ruleState } from '~/state/rules';
import { semanticTokenIds, semanticTokenState } from '~/state/semanticTokens';
import { themeStyle } from '~/state/theme';

import { GENERAL_SCOPES } from '~/constants';

import { Rule, SemanticToken } from '~/types';

const resetState = async (snapshot: MutableSnapshot): Promise<void> => {
    snapshot.reset(themeStyle);
    GENERAL_SCOPES.map(name => snapshot.reset(generalScopeState(name)));

    const ids = await snapshot.getPromise(ruleIds);
    let length = ids.length,
        i = 0;

    for (i = 0; i < length; i++) {
        const id = ids[i];
        const state = await snapshot.getPromise(ruleState(id));

        if (state) {
            const updated: Rule = {
                ...state,
                __meta: {
                    ...state.__meta!,
                    state: 'deleted',
                },
            };

            snapshot.set(ruleState(id), updated);
        }
    }

    const tokenIds = await snapshot.getPromise(semanticTokenIds);
    length = tokenIds.length;
    i = 0;

    for (let i = 0; i < length; i++) {
        const id = ids[i];
        const state = await snapshot.getPromise(semanticTokenState(id));

        if (state) {
            const updated: SemanticToken = {
                ...state,
                __meta: {
                    ...state.__meta!,
                    state: 'deleted',
                },
            };

            snapshot.set(semanticTokenState(id), updated);
        }
    }

    snapshot.set(semanticTokenIds, []);
};

export default resetState;
