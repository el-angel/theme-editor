import React, { ChangeEvent } from 'react';
import { useRecoilCallback } from 'recoil';

import generalScopeManager from '~/state/generalScopes';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import useAddRule from '~/hooks/useAddRule';
import useReset from '~/hooks/useReset';

import { GeneralScope, Rule } from '~/types';
import isTheme from '~/types/theme.guard';

const getFileJson = (event: ChangeEvent<HTMLInputElement>): Promise<Record<string, unknown>> => {
    const input = event.target;

    return new Promise((resolve, reject) => {
        if (!input?.files?.length) {
            reject();
            return;
        }

        const reader = new FileReader();

        reader.onload = (e): void => {
            resolve(JSON.parse(e.target?.result as string));
            return;
        };

        reader.readAsText(input.files[0]);
    });
};

const Open: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const reset = useReset();

    const onClick = (): void => {
        inputRef.current?.click();
    };

    const setGeneralScope = useRecoilCallback(({ set }) => (input: GeneralScope): void => {
        set(generalScopeManager(input.scope), input);
    });

    const addRule = useAddRule();

    const onSelectFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const json = await getFileJson(event);

        if (!isTheme(json)) {
            return;
        }

        reset();

        Object.keys(json.colors).map(scope => {
            setGeneralScope({
                scope,
                color: json.colors[scope],
            });
        });

        json.tokenColors.forEach(tokenColor => {
            const rule: Partial<Rule> = {
                ...tokenColor,
                scope: Array.isArray(tokenColor.scope) ? tokenColor.scope : [tokenColor.scope],
                settings: {
                    ...tokenColor.settings,
                    fontStyle: (tokenColor.settings.fontStyle
                        ? [tokenColor.settings.fontStyle]
                        : []) as ('bold' | 'italic' | 'underline')[],
                },
            };

            addRule(rule);
        });
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="application/JSON"
                onChange={onSelectFile}
                style={{ display: 'none' }}
            />
            <SettingsMenuItem onClick={onClick}>Open</SettingsMenuItem>
        </>
    );
};

export default Open;
