import { useRecoilCallback, useRecoilState } from 'recoil';

import ruleManager from '~/state/rules';
import editRuleState from '~/state/rules/edit';

import { Rule } from '~/types';

type ReturnType = (input: Rule | string) => void;

const useDeleteRule = (): ReturnType => {
    const [editingId, setEditId] = useRecoilState(editRuleState);

    const deleteRule = useRecoilCallback(
        ({ set, snapshot }) => async (input: Rule | string): Promise<void> => {
            const id = typeof input === 'string' ? input : input.id;

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

            if (editingId === id) {
                setEditId('');
            }
        },
        [editingId, setEditId],
    );

    return deleteRule;
};

export default useDeleteRule;
