import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { getRule, getRules } from '~/state/rules';
import { entitySettingsState } from '~/state/ui';

import PanelSettings from '~/components/ui/PanelSettings';

import useDeleteEntity from '~/hooks/useDeleteEntity';
import useViewEntity from '~/hooks/useViewEntity';

// import useViewRule from '~/hooks/useViewRule';
import { FontStyle as FontStyleEnum } from '~/constants';

import getExistingScopes from '~/helpers/getExistingScopes';

const RuleSettings: React.FC = () => {
    const rules = useRecoilValue(getRules);
    const deleteEntity = useDeleteEntity();
    const viewEntity = useViewEntity();
    const entity = useRecoilValue(entitySettingsState);
    const rule = useRecoilValue(getRule(entity?.id));

    const updateRule = useSetRecoilState(getRule(entity?.id));

    const toggleFontStyle = React.useCallback(
        (fontStyle: FontStyleEnum) => {
            let styles = [...rule!.settings.fontStyle] || [];

            if (typeof styles === 'string') {
                styles = [styles];
            }

            if (styles.includes(fontStyle)) {
                styles.splice(styles.indexOf(fontStyle), 1);
            } else {
                styles.push(fontStyle);
            }

            updateRule!({
                ...rule!,
                settings: {
                    ...rule!.settings,
                    fontStyle: styles,
                },
            });
        },
        [updateRule, rule],
    );

    const onChangeColor = React.useCallback(
        (color: string) => {
            updateRule!({
                ...rule!,
                settings: {
                    ...rule!.settings,
                    foreground: color,
                },
            });
        },
        [updateRule, rule],
    );

    if (!rule?.id) {
        return null;
    }

    return (
        <PanelSettings
            onClose={(): void => viewEntity()}
            onChangeName={(name): void => updateRule({ ...rule, name })}
            existingScopes={getExistingScopes(rule, rules)}
            scopes={rule.scope}
            onDeleteScope={(scope: string): void => {
                const index = rule.scope.findIndex(sc => sc === scope);
                const newScopes = [...rule.scope];
                newScopes.splice(index, 1);
                updateRule({
                    ...rule,
                    scope: newScopes,
                });
            }}
            onDelete={(): void => deleteEntity(rule)}
            onChangeColor={onChangeColor}
            onChangeFontStyle={(fontStyle): void => toggleFontStyle(fontStyle)}
            bold={rule.settings.fontStyle?.includes(FontStyleEnum.Bold)}
            italic={rule.settings.fontStyle?.includes(FontStyleEnum.Italic)}
            underline={rule.settings.fontStyle?.includes(FontStyleEnum.Underline)}
            color={rule.settings.foreground}
            onAddScope={(scope: string) =>
                updateRule({
                    ...rule!,
                    scope: [scope, ...rule!.scope],
                })
            }
            name={rule.name}
        />
    );
};

export default RuleSettings;
