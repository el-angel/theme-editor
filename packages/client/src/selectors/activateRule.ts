import { selector } from 'recoil';

import mode from '~/state/mode';
import { getAllRules } from '~/state/rules';
import activeScope from '~/state/rules/active';
import editRuleState from '~/state/rules/edit';

import ruleMatch from '~/helpers/ruleMatch';
import { selectorKey } from '~/helpers/state';

export const activateRuleByScope = selector<string>({
    key: selectorKey('ActivateRuleByScope'),
    get: ({ get }) => get(activeScope),
    set: ({ get, set }, input) => {
        const scope = input as string;

        set(activeScope, scope);
        const rules = get(getAllRules);

        const rule = ruleMatch(rules, [scope]);

        if (rule) {
            set(mode, 'rules');
            set(editRuleState, rule.rule.id);
        }
    },
});
