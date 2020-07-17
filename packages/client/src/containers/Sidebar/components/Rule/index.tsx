import React from 'react';
import { useRecoilValue } from 'recoil';
import { unstable_trace as trace } from 'scheduler/tracing';

import { getAllRules } from '~/state/rules';
import editRuleState from '~/state/rules/edit';

import SidebarItem from '~/components/ui/SidebarItem';

import useViewRule from '~/hooks/useViewRule';

import getExistingScopes from '~/helpers/getExistingScopes';

import { Rule as RuleType } from '~/types';

const Rule: React.FC<RuleType> = props => {
    const { id, name, settings, scope } = props;
    const viewRule = useViewRule();
    const rules = useRecoilValue(getAllRules);
    const editingRuleId = useRecoilValue(editRuleState);

    const existingScopes = getExistingScopes({ id, name, settings, scope }, rules);

    const isActive = editingRuleId === id;

    return (
        <SidebarItem
            isActive={isActive}
            onClick={(): void => {
                if (!isActive) {
                    viewRule(id);
                }
            }}
            title={name}
            color={settings.foreground}
            showWarning={!!existingScopes.length}
        />
    );
};

export default Rule;
