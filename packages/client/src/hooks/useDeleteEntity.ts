import { useRecoilCallback } from 'recoil';

import mode from '~/state/mode';
import { getRule } from '~/state/rules';
import { semanticTokenState } from '~/state/semanticTokens';
import { entitySettingsState } from '~/state/ui';

import { isRule, isSemanticToken } from '~/helpers/typeGuards';

import { Entity, Rule, SemanticToken } from '~/types';

type ReturnType = (input: Entity) => void;

const useDeleteEntity = (): ReturnType => {
    const deleteEntity = useRecoilCallback(
        ({ set, snapshot }) => async (input: Entity): Promise<void> => {
            const id = typeof input === 'string' ? input : input.id;

            const editEntity = await snapshot.getPromise(entitySettingsState);
            const currentMode = await snapshot.getPromise(mode);

            let getter;

            if (isRule(input)) {
                getter = getRule;
            }

            if (isSemanticToken(input)) {
                getter = semanticTokenState;
            }

            if (!getter) {
                throw new Error(`${input.id} cannot be deleted.`);
            }

            const stateValue = await snapshot.getPromise<Rule | SemanticToken>(getter(input.id));

            if (stateValue) {
                const deletedEntity = {
                    ...stateValue,
                    __meta: {
                        ...stateValue.__meta!,
                        state: 'deleted',
                    },
                };

                set(getter(input.id), deletedEntity);
            }

            if (editEntity?.id === id && currentMode === editEntity.__meta.type) {
                set(entitySettingsState, undefined);
            }
        },
        [],
    );

    return deleteEntity;
};

export default useDeleteEntity;
