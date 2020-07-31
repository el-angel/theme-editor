import { useRecoilCallback } from 'recoil';

import { entitySettingsState } from '~/state/ui';

import { Base } from '~/types';

const useViewEntity = (): (<T extends Base>(input?: T) => void) => {
    const viewEntity = useRecoilCallback(
        ({ set }) => <T extends Base>(input?: T): void => {
            if (input) {
                set(entitySettingsState, input);
                return;
            }

            set(entitySettingsState, undefined);
        },
        [],
    );

    return viewEntity;
};

export default useViewEntity;
