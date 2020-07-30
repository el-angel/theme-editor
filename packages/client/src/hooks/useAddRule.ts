import { useRecoilCallback } from 'recoil';

import { getRule, ruleIds } from '~/state/rules';

import createRule from '~/model/rule';

import { Rule } from '~/types';

type ReturnType = (input: Partial<Rule>, filterScope?: boolean) => void;

const useAddRule = (): ReturnType => {
    const addRule = useRecoilCallback(
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ({ set, snapshot }) => async (input: Partial<Rule>, filterScope = false): Promise<void> => {
            const existingIds = await snapshot.getPromise(ruleIds);

            const rule = createRule(input, { existingIds, filterScope: <boolean>filterScope });

            set(getRule(rule.id), rule);
        },
        [],
    );

    return addRule;
};

export default useAddRule;
