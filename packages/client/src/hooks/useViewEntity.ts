import { useRecoilCallback } from 'recoil';

import { entitySettingsState } from '~/state/ui';

import { Base } from '~/types';

const useViewEntity = (): ((input?: Base) => void) => {
    const viewEntity = useRecoilCallback(
        ({ set }) => (input?: Base): void => {
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
