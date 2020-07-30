import { MutableSnapshot } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';
import { getRule, ruleIds } from '~/state/rules';
import { themeStyle } from '~/state/theme';

import { GENERAL_SCOPES } from '~/constants';

import { Rule } from '~/types';

const resetState = async (snapshot: MutableSnapshot): Promise<void> => {
    snapshot.reset(themeStyle);
    GENERAL_SCOPES.map(name => snapshot.reset(getGeneralScope(name)));

    const ids = await snapshot.getPromise(ruleIds);

    ids.forEach(async id => {
        const state = await snapshot.getPromise(getRule(id));

        if (state) {
            const updatedRule: Rule = {
                ...state,
                __meta: {
                    ...state.__meta!,
                    state: 'deleted',
                },
            };

            snapshot.set(getRule(id), updatedRule);
        }
    });

    snapshot.set(ruleIds, []);
};

export default resetState;
