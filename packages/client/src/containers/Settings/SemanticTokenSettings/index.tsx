import React from 'react';
import { useRecoilState } from 'recoil';

// import { editRuleState } from '~/state/rules';
import { getSemanticToken } from '~/state/semanticTokens';

import PanelSettings from '~/components/ui/PanelSettings';

import { FontStyle as FontStyleEnum } from '~/constants';

// import getExistingScopes from '~/helpers/getExistingScopes';

// import css from './styles.module.scss';

// const fontStyleMap = {
//     [FontStyleEnum.Bold]: 'bold',
//     [FontStyleEnum.Italic]: 'italic',
//     [FontStyleEnum.Underline]: 'underline',
// } as const;

const SemanticTokenSettings: React.FC = () => {
    // const semanticTokens = useRecoilValue(getEntities);
    // const deleteRule = useDeleteEntity();
    // const setViewRule = useViewRule();
    // const id = useRecoilValue(editId);
    const id = '1';
    const [entity, updateEntity] = useRecoilState(getSemanticToken(id));

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
                console.log('close');
            }}
            // onChangeName={(name): void => updateEntity({ ...entity, name })}
            // existingScopes={getExistingScopes(rule, rules)}
            scopes={[entity.scope]}
            // onDeleteScope={(scope: string): void => {
            //     const index = rule.scope.findIndex(sc => sc === scope);
            //     const newScopes = [...rule.scope];
            //     newScopes.splice(index, 1);
            //     updateRule({
            //         ...rule,
            //         scope: newScopes,
            //     });
            // }}
            // onDelete={(): void => deleteRule(rule)}
            onChangeColor={onChangeColor}
            onChangeFontStyle={(fontStyle): void => toggleFontStyle(fontStyle)}
            bold={entity.settings.fontStyle?.includes(FontStyleEnum.Bold)}
            italic={entity.settings.fontStyle?.includes(FontStyleEnum.Italic)}
            underline={entity.settings.fontStyle?.includes(FontStyleEnum.Underline)}
            color={entity.settings.foreground}
            // onAddScope={(scope: string) =>
            //     updateEntity({
            //         ...rule!,
            //         scope: [scope, ...rule!.scope],
            //     })
            // }
            name={entity.scope}
        />
    );
};

export default SemanticTokenSettings;
