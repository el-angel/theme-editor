import React from 'react';
import { useRecoilCallback } from 'recoil';

import { generalScopesState } from '~/state/generalScopes';
import { rulesState } from '~/state/rules';
import { semanticTokensState } from '~/state/semanticTokens';
import { themeStyle } from '~/state/theme';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import { GeneralScope, Rule, SemanticToken } from '~/types';
import { SemanticTokenRules, TextMateRule, Theme } from '~/types/theme';

interface Options {
    semanticTokens: SemanticToken[];
    name: string;
    generalScopes: GeneralScope[];
    rules: Rule[];
    type: 'dark' | 'light';
}

const createSemanticTokensObj = (tokens: SemanticToken[]): SemanticTokenRules => {
    return tokens.reduce(
        (acc: SemanticTokenRules, token) => ({
            ...acc,
            [token.scope]: {
                foreground: token.settings.foreground,
                ...(token.settings.fontStyle!.length > 0
                    ? {
                          fontStyle: token.settings.fontStyle!.join(' '),
                      }
                    : {}),
            },
        }),
        {},
    );
};

const ruleTransformer = (rule: Rule): TextMateRule => ({
    name: rule.name,
    scope: rule.scope,
    settings: {
        ...(rule.settings.fontStyle!.length > 0
            ? {
                  fontStyle: rule.settings.fontStyle!.join(' '),
              }
            : {}),
        foreground: rule.settings.foreground,
    },
});

const createThemeColorsObj = (scopes: GeneralScope[]): Theme['colors'] => {
    return scopes.reduce(
        (acc, scope) => ({
            ...acc,
            [scope.id]: scope.settings.foreground,
        }),
        {},
    );
};

const createTheme = (opts: Options): Theme => ({
    name: opts.name,
    colors: createThemeColorsObj(opts.generalScopes),
    semanticHighlighting: opts.semanticTokens.length > 0,
    tokenColors: opts.rules.map(ruleTransformer),
    type: opts.type,
    semanticTokenColors: createSemanticTokensObj(opts.semanticTokens),
});

const Export: React.FC = () => {
    const name = 'by https://github.com/el-angel/theme-editor';

    const download = useRecoilCallback(
        ({ snapshot }) => async () => {
            const rules = await snapshot.getPromise(rulesState);
            const semanticTokens = await snapshot.getPromise(semanticTokensState);
            const generalScopes = await snapshot.getPromise(generalScopesState);
            const type = await snapshot.getPromise(themeStyle);
            const theme = createTheme({ rules, generalScopes, name, type, semanticTokens });
            const json = JSON.stringify(theme, null, 2);

            const elem = document.createElement('a');
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);

            elem.setAttribute('href', dataStr);
            elem.setAttribute('download', 'theme.json');
            elem.setAttribute('style', 'display: none;');
            document.body.appendChild(elem);
            elem.click();
            elem.remove();
        },
        [],
    );

    return <SettingsMenuItem onClick={download}>Export</SettingsMenuItem>;
};

export default Export;
