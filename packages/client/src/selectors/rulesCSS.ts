import { selector } from 'recoil';

import { getRules, RULES_STATE_ID } from '~/state/rules';

import { FontStyle } from '~/constants';

import stringifyCss from '~/helpers/stringifyCss';

import { CSS, Rule } from '~/types';

import { selectorKey } from './../helpers/state';

export const getRulesCSS = selector({
    key: selectorKey(RULES_STATE_ID, 'CSS'),
    get: ({ get }) => {
        const rules = get(getRules);

        const css = rules.reduce((acc: CSS, rule: Rule) => {
            const ruleCss = rule.scope.reduce((cssAcc: CSS, scope) => {
                const css: React.CSSProperties = {
                    color: rule.settings.foreground,
                };

                if (rule.settings.fontStyle?.includes(FontStyle.Bold)) {
                    css.fontWeight = 'bold';
                }

                if (rule.settings.fontStyle?.includes(FontStyle.Italic)) {
                    css.fontStyle = 'italic';
                }

                if (rule.settings.fontStyle?.includes(FontStyle.Underline)) {
                    css.textDecoration = 'underline';
                }

                return {
                    ...cssAcc,
                    [scope.replace(/ /g, '.')]: css,
                };
            }, {});

            return {
                ...acc,
                ...ruleCss,
            };
        }, {} as CSS);

        return stringifyCss(css);
    },
});
