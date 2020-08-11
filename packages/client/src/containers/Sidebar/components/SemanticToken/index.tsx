import React from 'react';
import { useRecoilValue } from 'recoil';

import { entitySettingsState } from '~/state/ui';

import SidebarItem from '~/components/ui/SidebarItem';

import useViewEntity from '~/hooks/useViewEntity';

import { EntityType } from '~/constants';

import { SemanticToken as SemanticTokenType } from '~/types';

const SemanticToken: React.FC<SemanticTokenType> = props => {
    const { id, settings, scope } = props;
    const viewEntity = useViewEntity();
    const editingEntity = useRecoilValue(entitySettingsState);

    const isActive = editingEntity?.id === id && editingEntity.__type === EntityType.SemanticToken;

    return (
        <SidebarItem
            isActive={isActive}
            onClick={(): void => {
                if (!isActive) {
                    viewEntity(props);
                }
            }}
            title={scope}
            color={settings.foreground}
        />
    );
};

export default SemanticToken;
