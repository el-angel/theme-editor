import React from 'react';
import { useRecoilValue } from 'recoil';

import { getRules } from '~/state/rules';
import { entitySettingsState } from '~/state/ui';

// import { editRuleState } from '~/state/rules';
import SidebarItem from '~/components/ui/SidebarItem';

import useViewEntity from '~/hooks/useViewEntity';

// import useViewRule from '~/hooks/useViewRule';
import getExistingScopes from '~/helpers/getExistingScopes';

import { Rule as RuleType } from '~/types';

const Rule: React.FC<RuleType> = props => {
    const { id, name, settings } = props;
    const viewEntity = useViewEntity();
    const rules = useRecoilValue(getRules);

    const editingEntity = useRecoilValue(entitySettingsState);

    const existingScopes = getExistingScopes(props, rules);

    const isActive = editingEntity?.id === id;

    return (
        <SidebarItem
            isActive={isActive}
            onClick={(): void => {
                if (!isActive) {
                    viewEntity(props);
                }
            }}
            title={name}
            color={settings.foreground}
            showWarning={!!existingScopes.length}
        />
    );
};

export default Rule;
