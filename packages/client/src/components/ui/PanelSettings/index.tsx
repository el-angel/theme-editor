import React from 'react';

import ColorPicker from '~/containers/Settings/components/ColorPicker';
import FontStyle from '~/containers/Settings/components/FontStyle';
import NameInput from '~/containers/Settings/components/NameInput';
import ScopesList from '~/containers/Settings/components/ScopesList';
import Swatches from '~/containers/Settings/components/Swatches';

import Button from '~/components/ui/Button';
import Panel from '~/components/ui/Panel';

import { FontStyle as FontStyleEnum } from '~/constants';

import { Rule } from '~/types';

import css from './styles.module.scss';

interface Props {
    onAddScope?: (scope: string) => void;
    onChangeFontStyle?: (style: FontStyleEnum) => void;
    onChangeName?: (name: string) => void;
    onDelete?: () => void;
    onClose: () => void;
    onChangeColor: (color: string) => void;
    name?: string;
    color: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    scopes?: Rule['scope'];
    existingScopes?: string[];
    onDeleteScope?: (scope: string) => void;
}

const PanelSettings: React.FC<Props> = ({
    onClose,
    onChangeName,
    onChangeFontStyle,
    onChangeColor,
    onDelete,
    onAddScope,
    name,
    color,
    bold,
    italic,
    underline,
    scopes,
    existingScopes,
    onDeleteScope,
}) => {
    const [newScope, setNewScope] = React.useState<string>('');

    const onAddScopeInputChange = React.useCallback(
        (evt: React.ChangeEvent) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            setNewScope(evt.target.value);
        },
        [setNewScope],
    );

    const onAddScopeInputKeyDown = React.useCallback(
        (evt: React.KeyboardEvent) => {
            if (['Enter', ','].includes(evt.key)) {
                evt.preventDefault();

                onAddScope && onAddScope(newScope);

                setNewScope('');
            }
        },
        [onAddScope, newScope],
    );

    return (
        <Panel onClose={onClose}>
            <div className={css.container}>
                <div className={css.top}>
                    <div className={css.left}>
                        <div>
                            {name && (
                                <NameInput
                                    value={name}
                                    readonly={!onChangeName}
                                    onChange={onChangeName}
                                />
                            )}
                            <div className={css.scopesList}>
                                {!!(scopes && existingScopes && onDeleteScope) && (
                                    <ScopesList
                                        existingScopes={existingScopes}
                                        scopes={scopes}
                                        onDelete={onDeleteScope}
                                    />
                                )}
                            </div>
                        </div>
                        {onDelete && <Button onClick={onDelete}>Delete</Button>}
                    </div>
                    <div className={css.tools}>
                        <div className={css.picker}>
                            <ColorPicker value={color} onChange={onChangeColor} />
                        </div>
                        {onChangeFontStyle && (
                            <>
                                <FontStyle
                                    type={FontStyleEnum.Bold}
                                    onClick={(): void => onChangeFontStyle(FontStyleEnum.Bold)}
                                    enabled={bold || false}
                                />
                                <FontStyle
                                    type={FontStyleEnum.Italic}
                                    onClick={(): void => onChangeFontStyle(FontStyleEnum.Italic)}
                                    enabled={italic || false}
                                />
                                <FontStyle
                                    type={FontStyleEnum.Underline}
                                    onClick={(): void => onChangeFontStyle(FontStyleEnum.Underline)}
                                    enabled={underline || false}
                                />
                            </>
                        )}
                    </div>
                    <div className={css.colorContainer}>
                        <Swatches
                            color={color}
                            onColorSelect={(color): void => onChangeColor(color)}
                        />
                    </div>
                </div>
                {onAddScope && (
                    <div className={css.addScope}>
                        <input
                            className={css.addScopeInput}
                            type="text"
                            placeholder="Add scope"
                            value={newScope}
                            onChange={onAddScopeInputChange}
                            onKeyDown={onAddScopeInputKeyDown}
                        />
                    </div>
                )}
            </div>
        </Panel>
    );
};
export default PanelSettings;
