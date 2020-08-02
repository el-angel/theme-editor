import React from 'react';
import { useRecoilValue } from 'recoil';

import { entitySettingsState } from '~/state/ui';

import SidebarItem from '~/components/ui/SidebarItem';

import useViewEntity from '~/hooks/useViewEntity';

import { GeneralScope as GeneralScopeType } from '~/types';

const GeneralScope: React.FC<GeneralScopeType> = props => {
    const { id, settings } = props;

    const viewEntity = useViewEntity();

    const editingEntity = useRecoilValue(entitySettingsState);

    const isActive = id === editingEntity?.id;

    if (!props.id) {
        return null;
    }

    return (
        <>
            <SidebarItem
                isActive={isActive}
                onClick={(): void => viewEntity(props)}
                title={id}
                color={settings.foreground}
            />
        </>
    );
};

export default GeneralScope;
