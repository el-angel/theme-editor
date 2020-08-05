import React, { ChangeEvent } from 'react';
import { useRecoilCallback } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';
import { getRule, ruleIds } from '~/state/rules';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';
import FontStyle from '~/containers/Settings/components/FontStyle';

import generalScopesDefault from '~/helpers/generalScopesDefault';

import createRule from '~/model/rule';

import { Rule } from '~/types';
import isTheme from '~/types/theme.guard';

import resetState from '~/recoil/snapshot/reset';

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

    const onClick = (): void => {
        inputRef.current?.click();
    };

    const onSelectFile = useRecoilCallback(
        ({ snapshot, gotoSnapshot }) => async (
            event: ChangeEvent<HTMLInputElement>,
        ): Promise<void> => {
            const json = await getFileJson(event);

            if (!isTheme(json)) {
                return;
            }

            const existingIds = await snapshot.getPromise(ruleIds);

            const newSnapshot = await snapshot.asyncMap(async mutableSnapshot => {
                await resetState(mutableSnapshot);

                const { set } = mutableSnapshot;

                Object.keys(json.colors).map(scope => {
                    if (generalScopesDefault[scope]) {
                        set(getGeneralScope(scope), {
                            scope,
                            settings: {
                                foreground: json.colors[scope],
                            },
                        });
                    }
                });

                json.tokenColors.forEach(tokenColor => {
                    const input: Partial<Rule> = {
                        ...tokenColor,
                        scope: Array.isArray(tokenColor.scope)
                            ? tokenColor.scope
                            : [tokenColor.scope],
                        settings: {
                            ...tokenColor.settings,
                            fontStyle: (tokenColor.settings.fontStyle || '')
                                .split(' ')
                                .map(style => FontStyle[style]),
                        },
                    };

                    const rule = createRule(input, { existingIds });

                    set(getRule(rule.id), rule);
                });
            });

            inputRef.current!.value = '';

            gotoSnapshot(newSnapshot);
        },
    );

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
