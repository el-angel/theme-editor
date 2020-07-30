import React from 'react';

// import { getRules } from '~/state/rules';
// import { editRuleState } from '~/state/rules';
import SidebarItem from '~/components/ui/SidebarItem';

// import useViewRule from '~/hooks/useViewRule';
// import getExistingScopes from '~/helpers/getExistingScopes';
import { SemanticToken as SemanticTokenType } from '~/types';

const SemanticToken: React.FC<SemanticTokenType> = props => {
    const { id, settings } = props;
    // const viewRule = useView();
    // const rules = useRecoilValue(getRules);
    // const editingRuleId = useRecoilValue(editRuleState);
    const editingRuleId = '1';

    // const existingScopes = getExistingScopes({ id, name, settings, scope }, rules);

    const isActive = editingRuleId === id;

    return (
        <SidebarItem
            isActive={isActive}
            onClick={(): void => {
                if (!isActive) {
                    // viewRule(id);
                }
            }}
            title={name}
            color={settings.foreground}
            // showWarning={!!existingScopes.length}
        />
    );
};

export default SemanticToken;
