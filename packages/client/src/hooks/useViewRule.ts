import { useRecoilCallback, useRecoilValue } from 'recoil';

import { getRuleIds } from '~/state/rules';
import editRuleState from '~/state/rules/edit';

import { Rule } from '~/types';

const useViewRule = (): ((input?: Rule | string) => void) => {
  const ids = useRecoilValue(getRuleIds);

  const viewRule = useRecoilCallback(
    ({ set }) => (input?: Rule | string): void => {
      const id = typeof input === 'string' ? input : input?.id;

      if (id && ids.includes(id)) {
        set(editRuleState, id);
        return;
      }

      set(editRuleState, '');
    },
    [ids],
  );

  return viewRule;
};

export default useViewRule;
