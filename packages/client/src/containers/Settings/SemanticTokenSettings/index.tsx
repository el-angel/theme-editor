import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

// import { editRuleState } from '~/state/rules';
import { semanticTokenState } from '~/state/semanticTokens';
import { entitySettingsState } from '~/state/ui';

import PanelSettings from '~/components/ui/PanelSettings';

import useDeleteEntity from '~/hooks/useDeleteEntity';
import useViewEntity from '~/hooks/useViewEntity';

import { FontStyle as FontStyleEnum } from '~/constants';

const SemanticTokenSettings: React.FC = () => {
    const editingEntity = useRecoilValue(entitySettingsState);
    const [entity, updateEntity] = useRecoilState(semanticTokenState(editingEntity?.id));
    const viewEntity = useViewEntity();
    const deleteEntity = useDeleteEntity();

    const toggleFontStyle = React.useCallback(
        (fontStyle: FontStyleEnum) => {
            let styles = [...entity!.settings.fontStyle] || [];

            if (typeof styles === 'string') {
                styles = [styles];
            }

            if (styles.includes(fontStyle)) {
                styles.splice(styles.indexOf(fontStyle), 1);
            } else {
                styles.push(fontStyle);
            }

            updateEntity!({
                ...entity!,
                settings: {
                    ...entity!.settings,
                    fontStyle: styles,
                },
            });
        },
        [entity, updateEntity],
    );

    const onChangeColor = React.useCallback(
        (color: string) => {
            updateEntity!({
                ...entity!,
                settings: {
                    ...entity!.settings,
                    foreground: color,
                },
            });
        },
        [entity, updateEntity],
    );

    if (!entity?.id) {
        return null;
    }

    return (
        <PanelSettings
            onClose={(): void => {
                viewEntity();
            }}
            onDelete={(): void => deleteEntity(entity)}
            onChangeColor={onChangeColor}
            onChangeFontStyle={(fontStyle): void => toggleFontStyle(fontStyle)}
            bold={entity.settings.fontStyle?.includes(FontStyleEnum.Bold)}
            italic={entity.settings.fontStyle?.includes(FontStyleEnum.Italic)}
            underline={entity.settings.fontStyle?.includes(FontStyleEnum.Underline)}
            color={entity.settings.foreground}
            name={entity.scope}
        />
    );
};

export default SemanticTokenSettings;
