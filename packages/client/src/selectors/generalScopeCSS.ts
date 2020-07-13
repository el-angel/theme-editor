import { selector } from 'recoil';

import generalScopeManager from '~/state/generalScopes';

import { GENERAL_SCOPES } from '~/constants';

import { selectorKey } from '~/helpers/state';

const getGeneralScopesCSS = selector<string>({
  key: selectorKey('GeneralScopesCSS'),
  get: ({ get }) => {
    const scopes = GENERAL_SCOPES;

    const css = scopes.reduce((acc, name) => {
      const { scope, color } = get(generalScopeManager(name))!;

      const formatted = `--${scope.replace(/\./, '-')}`;

      return `
        ${acc}
        ${formatted}: ${color};
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
