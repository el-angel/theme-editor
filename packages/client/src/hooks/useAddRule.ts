import { uniqueId } from 'lodash';
import { useRecoilCallback } from 'recoil';

import ruleManager, { getRuleIds } from '~/state/rules';

import createRule from '~/model/rule';

import { Rule } from '~/types';

type ReturnType = (input?: Partial<Rule>) => void;

const useAddRule = (): ReturnType => {
  const addRule = useRecoilCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ({ set, snapshot }) => async (input?: Partial<Rule>): Promise<void> => {
      const filteredScopes = (input?.scope || []).map(scope => {
        const splitted = scope.split('.');
        // remove extension from scope to support more language
        // otherwise theme will only work for this language
        splitted.pop();
        return splitted.join('.');
      });

      const ids = await snapshot.getPromise(getRuleIds);

      let id = uniqueId();

      while (ids.includes(id)) {
        id = uniqueId();
      }

      const rule = createRule({
        ...input,
        id,
        scope: filteredScopes,
      });

      set(ruleManager(id), rule);
    },
    [],
  );

  return addRule;
};

export default useAddRule;
