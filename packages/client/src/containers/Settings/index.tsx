import React from 'react';
import { useRecoilValue } from 'recoil';

import mode from '~/state/mode';
import { entitySettingsState } from '~/state/ui';

import GeneralSettings from '~/containers/Settings/GeneralSettings';
import RuleSettings from '~/containers/Settings/RuleSettings';
import SemanticTokenSettings from '~/containers/Settings/SemanticTokenSettings';

import { EntityType } from '~/constants';

const Settings: React.FC = () => {
    // const rules = useRecoilValue(rulesState);
    // const deleteRule = useDeleteEntity();
    // const setViewRule = useViewRule();
    // const id = useRecoilValue(editRuleState);
    const currentMode = useRecoilValue(mode);
    const input = useRecoilValue(entitySettingsState);

    if (!input) {
        return null;
    }

    if (currentMode === EntityType.GeneralScope) {
        return <GeneralSettings />;
    }

    if (currentMode === EntityType.Rule) {
        return <RuleSettings />;
    }

    return <SemanticTokenSettings />;
};

export default Settings;
