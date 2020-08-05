import { atom, selector } from 'recoil';

import { generalScopeState } from '~/state/generalScopes';
import { rulesState } from '~/state/rules';
import { semanticTokensState } from '~/state/semanticTokens';

import { GENERAL_SCOPES } from '~/constants';

import { atomKey, selectorKey } from '~/helpers/state';

export const filter = atom({
    key: atomKey('Sidebar', 'FilterAdd'),
    default: '',
});

export const sidebarRules = selector({
    key: selectorKey('Sidebar', 'FilteredRules'),
    get: ({ get }) => {
        const query = get(filter).toLowerCase();
        const rules = get(rulesState);

        return rules.filter(rule => {
            return (
                rule.name.toLowerCase().indexOf(query) !== -1 ||
                rule.scope.some(scope => scope.toLowerCase().indexOf(query) !== -1)
            );
        });
    },
});

export const sidebarGeneralScopes = selector({
    key: selectorKey('Sidebar', 'FilteredGeneralScope'),
    get: ({ get }) => {
        const query = get(filter).toLowerCase();

        const scopes = GENERAL_SCOPES.map(scope => get(generalScopeState(scope)));

        return scopes.filter(generalScope => {
            return generalScope.id.toLowerCase().indexOf(query) !== -1;
        });
    },
});

export const sidebarSemanticTokens = selector({
    key: selectorKey('Sidebar', 'FilteredSemanticTokens'),
    get: ({ get }) => {
        const query = get(filter).toLowerCase();
        const tokens = get(semanticTokensState);

        return tokens.filter(token => {
            return token.scope.toLowerCase().indexOf(query) !== -1;
        });
    },
});
