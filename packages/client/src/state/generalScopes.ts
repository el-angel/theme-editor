import { atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';

import { themeStyle } from '~/state/theme';

import storage from '~/services/storage';

import { EntityType, GENERAL_SCOPES } from '~/constants';

import generalScopesDefault from '~/helpers/generalScopesDefault';
import { atomKey, selectorKey } from '~/helpers/state';
import factory from '~/helpers/tokenStateFactory';

import { GeneralScope } from '~/types';

const getScopeDefault = (scope: string, style: 'light' | 'dark'): { id: string; color: string } => {
    console.log({ scope });

    const _scope = generalScopesDefault[scope];
    return {
        id: scope,
        color: _scope[style] || '',
    };
};

// export const _scopesFamily = atomFamily<GeneralScope, string>({
//     key: atomKey('GeneralScopes', 'Family'),
//     default:
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
// });

// const generalScopeManager = selectorFamily<Maybe<GeneralScope>, Maybe<string>>({
//     key: selectorKey('GeneralScopes', 'Manager'),
//     get: id => ({ get }): Maybe<GeneralScope> => {
//         if (!id) {
//             return undefined;
//         }

//         const scope = get(_scopesFamily(id));

//         return scope;
//     },
//     set: id => ({ get, set }, input): void => {
//         if (!id) {
//             return;
//         }

//         // RESET
//         if (input instanceof DefaultValue) {
//             const style = get(themeStyle);

//             set(_scopesFamily(id), {
//                 ...getScopeDefault(id, style),
//             });
//             storage.remove(atomKey('GeneralScopes', `scope__"${id}"`));
//             return;
//         }

//         set(_scopesFamily(id), {
//             ...(input as GeneralScope),
//             __meta: {
//                 touched: true,
//             },
//         });

//         const scope = get(_scopesFamily(id));

//         /**
//          * @TODO Replace when Atom Effects is introduced
//          */
//         storage.set(atomKey('GeneralScopes', `scope__"${scope.id}"`), scope);
//     },
// });

// export const getAllScopes = selector<GeneralScope[]>({
//     key: selectorKey('GeneralScopes', 'All'),
//     get: ({ get }) => {
//         const scopes = GENERAL_SCOPES.map(name => get(generalScopeManager(name))) as GeneralScope[];

//         return scopes;
//     },
// });

// export default generalScopeManager;

const {
    TREE_ID: GENERAL_SCOPE_STATE_ID,
    getEntities: getGeneralScopes,
    getEntity: getGeneralScope,
} = factory({
    state: 'GeneralScopes',
    default: _default,
});

export { GENERAL_SCOPE_STATE_ID, getGeneralScopes, getGeneralScope };
