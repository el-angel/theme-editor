import React from 'react';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import dialog from '~/services/dialog';

import useReset from '~/hooks/useReset';

const New: React.FC = () => {
    const reset = useReset();

    const onClick = (): void => {
        dialog.confirm().then(() => {
            reset();
        });
    };
    return <SettingsMenuItem onClick={onClick}>New</SettingsMenuItem>;
};
export default New;
