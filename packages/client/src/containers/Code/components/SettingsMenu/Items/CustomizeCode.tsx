import React from 'react';
import { useRecoilState } from 'recoil';

import { editCodeState } from '~/state/code';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

const CustomizeCode: React.FC = () => {
    const [isEditing, setEditCode] = useRecoilState(editCodeState);
    const onClick = (): void => {
        setEditCode(!isEditing);
    };
    return (
        <SettingsMenuItem onClick={onClick}>
            {!isEditing ? 'Customize preview' : 'Save preview'}
        </SettingsMenuItem>
    );
};

export default CustomizeCode;
