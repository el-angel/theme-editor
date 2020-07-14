import { useRecoilCallback } from 'recoil';

import generalScopeManager from '~/state/generalScopes';
import ruleManager, { getRuleIds } from '~/state/rules';
import { themeStyle } from '~/state/theme';

import { GENERAL_SCOPES } from '~/constants';

import { Rule } from '~/types';

const useReset = (): (() => {}) => {
  const _reset = useRecoilCallback(({ reset, snapshot, set }) => async (): Promise<void> => {
    reset(themeStyle);
    GENERAL_SCOPES.map(name => reset(generalScopeManager(name)));

    const ids = await snapshot.getPromise(getRuleIds);

    ids.forEach(async id => {
      const state = await snapshot.getPromise(ruleManager(id));

      if (state) {
        const updatedRule: Rule = {
          ...state,
          __meta: {
            state: 'deleted',
          },
        };

        set(ruleManager(id), updatedRule);
      }
    });
  });

  return _reset;
};

export default useReset;
