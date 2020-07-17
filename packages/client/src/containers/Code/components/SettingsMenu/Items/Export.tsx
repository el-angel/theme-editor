import React from 'react';
import { useRecoilValue } from 'recoil';

import { getAllScopes } from '~/state/generalScopes';
import { getAllRules } from '~/state/rules';
import { themeStyle } from '~/state/theme';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import { GeneralScope, Rule } from '~/types';
import { Theme, ThemeRule } from '~/types/theme';

interface Options {
    name: string;
    generalScopes: GeneralScope[];
    rules: Rule[];
    type: 'dark' | 'light';
}

const ruleTransformer = (rule: Rule): ThemeRule => ({
    name: rule.name,
    scope: rule.scope,
    settings: {
        ...(rule.settings.fontStyle.length > 0
            ? {
                  fontStyle: rule.settings.fontStyle.join(' '),
              }
            : {}),
        foreground: rule.settings.foreground,
    },
});

const createThemeColorsObj = (scopes: GeneralScope[]): Theme['colors'] => {
    return scopes.reduce(
        (acc, scope) => ({
            ...acc,
            [scope.scope]: scope.color,
        }),
        {},
    );
};

const createTheme = (opts: Options): Theme => ({
    name: opts.name,
    colors: createThemeColorsObj(opts.generalScopes),
    semanticHighlighting: true,
    tokenColors: opts.rules.map(rule => ruleTransformer(rule)),
    type: opts.type,
});

const Export: React.FC = () => {
    const rules = useRecoilValue(getAllRules);
    const generalScopes = useRecoilValue(getAllScopes);
    const name = 'by https://github.com/el-angel/tmtheme-editor';
    const type = useRecoilValue(themeStyle);

    const download = (): void => {
        const theme = createTheme({ rules, generalScopes, name, type });
        const json = JSON.stringify(theme, null, 2);

        const elem = document.createElement('a');
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);

        elem.setAttribute('href', dataStr);
        elem.setAttribute('download', 'theme.json');
        elem.setAttribute('style', 'display: none;');
        document.body.appendChild(elem);
        elem.click();
        elem.remove();
    };

    return <SettingsMenuItem onClick={download}>Export</SettingsMenuItem>;
};

export default Export;
