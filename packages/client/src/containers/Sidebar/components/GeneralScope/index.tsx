import React from 'react';
import { useRecoilState } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';

import SidebarItem from '~/components/ui/SidebarItem';

import useViewEntity from '~/hooks/useViewEntity';

import { GeneralScope as GeneralScopeType } from '~/types';

interface Props {
    scope: string;
}

const GeneralScope: React.FC<Props> = ({ scope }) => {
    const [generalScope] = useRecoilState(getGeneralScope(scope));
    const viewEntity = useViewEntity();

    // const [editingScope, editScope] = useRecoilState(editGeneralScopeState);

    const isActive = (generalScope as GeneralScopeType)?.id === '1';

    if (!generalScope) {
        return null;
    }

    return (
        <>
            <SidebarItem
                isActive={isActive}
                onClick={(): void => viewEntity(generalScope)}
                title={generalScope.id}
                color={generalScope.settings.foreground}
            />
        </>
    );
};

export default GeneralScope;
