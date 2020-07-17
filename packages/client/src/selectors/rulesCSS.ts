import { selector } from 'recoil';

import { getAllRules } from '~/state/rules';

import { FONT_STYLE } from '~/constants';

import stringifyCss from '~/helpers/stringifyCss';

import { CSS, Rule } from '~/types';

import { selectorKey } from './../helpers/state';

export const getRulesCSS = selector({
    key: selectorKey('RulesCSS'),
    get: ({ get }) => {
        const rules = get(getAllRules);

        const css = rules.reduce((acc: CSS, rule: Rule) => {
            const ruleCss = rule.scope.reduce((cssAcc: CSS, scope) => {
                const css: React.CSSProperties = {
                    color: rule.settings.foreground,
                };

                if (rule.settings.fontStyle?.includes(FONT_STYLE.BOLD)) {
                    css.fontWeight = 'bold';
                }

                if (rule.settings.fontStyle?.includes(FONT_STYLE.ITALIC)) {
                    css.fontStyle = 'italic';
                }

                if (rule.settings.fontStyle?.includes(FONT_STYLE.UNDERLINE)) {
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
