import { atomFamily, DefaultValue, selector, selectorFamily } from 'recoil';

import { themeStyle } from '~/state/theme';

import storage from '~/services/storage';

import { GENERAL_SCOPES } from '~/constants';

import generalScopesDefault from '~/helpers/generalScopesDefault';
import { atomKey, selectorKey } from '~/helpers/state';

import { GeneralScope } from '~/types';

const getScopeDefault = (scope: string, style: 'light' | 'dark') => ({
    scope,
    color: generalScopesDefault[scope][style],
});

export const _scopesFamily = atomFamily<GeneralScope, string>({
    key: atomKey('GeneralScopesFamily'),
    default: selectorFamily({
        key: selectorKey('GeneralScopesFamily/Default'),
        get: param => ({ get }): GeneralScope => {
            const style = get(themeStyle);

            return getScopeDefault(param, style);
        },
    }),
});

const generalScopeManager = selectorFamily<Maybe<GeneralScope>, Maybe<string>>({
    key: selectorKey('GeneralScopeManager'),
    get: id => ({ get }): Maybe<GeneralScope> => {
        if (!id) {
            return undefined;
        }

        const scope = get(_scopesFamily(id));

        return scope;
    },
    set: id => ({ get, set }, input): void => {
        if (!id) {
            return;
        }

        // RESET
        if (input instanceof DefaultValue) {
            const style = get(themeStyle);

            set(_scopesFamily(id), {
                ...getScopeDefault(id, style),
            });
            storage.remove(atomKey(`GeneralScopesFamily__"${id}"`));
            return;
        }

        set(_scopesFamily(id), {
            ...(input as GeneralScope),
            __meta: {
                touched: true,
            },
        });

        const scope = get(_scopesFamily(id));

        /**
         * @TODO Replace when Atom Effects is introduced
         */
        storage.set(atomKey(`GeneralScopesFamily__"${scope.scope}"`), scope);
    },
});

export const getAllScopes = selector<GeneralScope[]>({
    key: selectorKey('AllScopes'),
    get: ({ get }) => {
        const scopes = GENERAL_SCOPES.map(name => get(generalScopeManager(name))) as GeneralScope[];

        return scopes;
    },
});

export default generalScopeManager;
