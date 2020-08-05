import { selector } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';

import { GENERAL_SCOPES } from '~/constants';

import { selectorKey } from '~/helpers/state';

const getGeneralScopesCSS = selector<string>({
    key: selectorKey('GeneralScopes', 'CSS'),
    get: ({ get }) => {
        const scopes = GENERAL_SCOPES;

        const css = scopes.reduce((acc, name) => {
            const generalScope = get(getGeneralScope(name))!;
            const {
                id,
                settings: { foreground },
            } = generalScope;

            const formatted = `--${id.replace(/\./, '-')}`;

            return `
        ${acc}
        ${formatted}: ${foreground};
      `.trim();
        }, '');

        return `
      :root {
        ${css}
      }
    `;
    },
});

export default getGeneralScopesCSS;
