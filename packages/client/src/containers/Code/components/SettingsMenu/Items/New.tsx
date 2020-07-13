import React from 'react';
import { useResetRecoilState } from 'recoil';
import { useRecoilCallback } from 'recoil';

import generalScopeManager from '~/state/generalScopes';
import ruleManager, { getAllRules, getRuleIds } from '~/state/rules';
import { themeStyle } from '~/state/theme';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import dialog from '~/services/dialog';

import { GENERAL_SCOPES } from '~/constants';

import { Rule } from '~/types';

const New: React.FC = () => {
  const reset = useRecoilCallback(({ reset, snapshot, set }) => async () => {
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

  const onClick = (): void => {
    dialog
      .confirm()
      .then(() => {
        console.log('yes!');
        reset();
      })
      .catch(() => {
        console.log('no!');
      });
  };
  return <SettingsMenuItem onClick={onClick}>New</SettingsMenuItem>;
};
export default New;
