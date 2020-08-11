import { useRecoilCallback } from 'recoil';

import mode from '~/state/mode';
import { ruleState } from '~/state/rules';
import { semanticTokenState } from '~/state/semanticTokens';
import { entitySettingsState } from '~/state/ui';

import { isRule, isSemanticToken } from '~/helpers/typeGuards';

import { Entity } from '~/types';

type ReturnType = (input: Entity) => void;

const useDeleteEntity = (): ReturnType => {
    const deleteEntity = useRecoilCallback(
        ({ set, snapshot, reset }) => async (input: Entity): Promise<void> => {
            const id = typeof input === 'string' ? input : input.id;

            const editEntity = await snapshot.getPromise(entitySettingsState);
            const currentMode = await snapshot.getPromise(mode);

            let getter;

            if (isRule(input)) {
                getter = ruleState;
            }

            if (isSemanticToken(input)) {
                getter = semanticTokenState;
            }

            if (!getter) {
                throw new Error(`${input.id} cannot be deleted.`);
            }

            reset(getter(input.id));

            if (editEntity?.id === id && currentMode === editEntity.__type) {
                set(entitySettingsState, undefined);
            }
        },
        [],
    );

    return deleteEntity;
};

export default useDeleteEntity;
