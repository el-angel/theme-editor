import { selectorFamily } from 'recoil';

import { themeStyle } from '~/state/theme';

import { EntityType } from '~/constants';

import generalScopesDefault from '~/helpers/generalScopesDefault';
import { selectorKey } from '~/helpers/state';
import factory from '~/helpers/tokenStateFactory';

import { GeneralScope } from '~/types';

const getScopeDefault = (scope: string, style: 'light' | 'dark'): { id: string; color: string } => {
    const _scope = generalScopesDefault[scope];
    return {
        id: scope,
        color: _scope[style] || '',
    };
};

const _default = selectorFamily({
    key: selectorKey('GeneralScopes', 'Family/Default'),
    get: param => ({ get }): GeneralScope => {
        const style = get(themeStyle);

        const defaults = getScopeDefault(param as string, style);
        return {
            id: defaults.id,
            scope: defaults.id,
            settings: {
                foreground: defaults.color,
            },
            __meta: {
                type: EntityType.GeneralScope,
            },
        };
    },
});

const {
    TREE_ID: GENERAL_SCOPE_STATE_ID,
    getEntities: generalScopesState,
    getEntity: generalScopeState,
} = factory({
    state: 'GeneralScopes',
    default: _default,
});

export { GENERAL_SCOPE_STATE_ID, generalScopesState, generalScopeState };
