import React from 'react';
import { useRecoilCallback } from 'recoil';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import { confirm } from '~/services/dialog';

import resetState from '~/recoil/snapshot/reset';

const New: React.FC = () => {
    const onClick = useRecoilCallback(({ snapshot, gotoSnapshot }) => (): void => {
        confirm()
            .then(async () => {
                const newSnapshot = await snapshot.asyncMap(async mutableSnapshot => {
                    await resetState(mutableSnapshot);
                });

                gotoSnapshot(newSnapshot);
            })
            .catch(() => null);
    });

    return <SettingsMenuItem onClick={onClick}>New</SettingsMenuItem>;
};
export default New;
