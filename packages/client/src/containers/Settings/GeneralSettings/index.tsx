import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';
import { entitySettingsState } from '~/state/ui';

// import editGeneralScopeState from '~/state/generalScopes/edit';
import PanelSettings from '~/components/ui/PanelSettings';

import useViewEntity from '~/hooks/useViewEntity';

const GeneralSettings: React.FC = () => {
    const input = useRecoilValue(entitySettingsState);
    const viewEntity = useViewEntity();
    const [generalScope, updateGeneralScope] = useRecoilState(getGeneralScope(input?.id));

    const onChangeColor = React.useCallback(
        (color: string) => {
            updateGeneralScope({
                ...generalScope!,
                settings: {
                    foreground: color,
                },
            });
        },
        [updateGeneralScope, generalScope],
    );

    if (!generalScope) {
        return null;
    }

    return (
        <PanelSettings
            onClose={(): void => viewEntity()}
            onChangeColor={onChangeColor}
            color={generalScope.settings.foreground}
            name={generalScope.id}
        />
    );
};
export default GeneralSettings;
