import { atom, atomFamily, selector, selectorFamily } from 'recoil';

import storage from '~/services/storage';

import { atomKey, selectorKey } from '~/helpers/state';

import { Rule } from '~/types';

const _rulesIdState = atom<string[]>({
    key: atomKey('RulesIds'),
    default: [],
});

export const getRuleIds = selector<string[]>({
    key: selectorKey('RulesIds'),
    get: ({ get }) => {
        const ids = get(_rulesIdState);
        return ids;
    },
});

export const ruleIds = selector<string[]>({
    key: selectorKey('RulesIds_SET'),
    get: ({ get }) => get(getRuleIds),
    set: ({ set }, input) => {
        set(_rulesIdState, input || []);
        storage.set(atomKey('RulesIds'), input || []);
    },
});

const _rulesState = atomFamily<Rule, string>({
    key: atomKey('Rules'),
    default: {
        id: '',
        name: '',
        scope: [],
        settings: {
            foreground: '#000000',
            fontStyle: [],
        },
        __meta: {},
    },
});

export const getAllRules = selector<Rule[]>({
    key: selectorKey('AllRules'),
    get: ({ get }) => {
        const ids = get(_rulesIdState);

        const state: Rule[] = ids.map(id => get(_rulesState(id)));

        return state;
    },
});

const ruleManager = selectorFamily<Maybe<Rule>, Maybe<string>>({
    key: selectorKey('RuleManager'),
    get: (id: Maybe<string>) => ({ get }): Maybe<Rule> => {
        if (!id) {
            return undefined;
        }

        const state = get(_rulesState(id));
        return state;
    },
    set: id => ({ set, get }, input): void => {
        if (!id) {
            return;
        }

        const rule = _rulesState(id);

        const ids = get(_rulesIdState);

        // new rule, add id to IdState
        if (!ids.includes(id)) {
            set(ruleIds, [...ids, id]);
        }

        // delete rule
        if ((<Rule>input)?.__meta?.state === 'deleted') {
            set(
                ruleIds,
                ids.filter(_id => _id !== id),
            );

            /**
             * @TODO Replace when Atom Effects is introduced
             */
            storage.remove(atomKey(`Rules__"${id}"`));
            return;
        }

        set(rule, {
            ...(<Rule>input),
            id,
            __meta: {
                touched: true,
            },
        });

        /**
         * @TODO Replace when Atom Effects is introduced
         */
        storage.set(atomKey(`Rules__"${id}"`), get(rule));
    },
});

export default ruleManager;
