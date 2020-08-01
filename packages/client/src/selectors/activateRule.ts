import { isNullOrUndefined } from 'util';

import { atom, selector } from 'recoil';

import mode from '~/state/mode';
import { getRules, RULES_STATE_ID } from '~/state/rules';

import getTextmateScopesRule from '~/helpers/ruleMatch';
import { selectorKey } from '~/helpers/state';

import { atomKey } from './../helpers/state';
import { entitySettingsState } from './../state/ui';

const activeScope = atom<string>({
    key: atomKey(RULES_STATE_ID, 'ActiveScope'),
    default: '',
});

export const activateRuleByScope = selector<string>({
    key: selectorKey(RULES_STATE_ID, 'ActivateRuleByScope'),
    get: ({ get }) => get(activeScope),
    set: ({ get, set }, input) => {
        const scope = input as string;

        set(activeScope, scope);
        const rules = get(getRules);

        const rule = getTextmateScopesRule(rules, [scope]);

        if (rule) {
            set(mode, 'rules');
            set(entitySettingsState, rule.rule);
        }
    },
});
