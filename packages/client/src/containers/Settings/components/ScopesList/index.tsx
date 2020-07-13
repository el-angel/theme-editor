import React from 'react';
import cx from 'classnames';

import { Rule } from '~/types';

import css from './styles.module.scss';

interface Props {
  scopes: Rule['scope'];
  existingScopes: string[];
  onDelete: (scope: string) => void;
}

const ScopesList: React.FC<Props> = ({ scopes, onDelete, existingScopes }) => {
  const scopesReversed = [...scopes].reverse();
  return (
    <div>
      {scopesReversed.map((scope, i) => {
        const exists = existingScopes.includes(scope);
        return (
          <div className={css.container} key={`${scope}-${i}`}>
            {exists && (
              <span className={css.warning} role="img" aria-label="warning">
                ❗️
              </span>
            )}
            <div
              className={cx(css.scope, {
                [css.exists]: exists,
              })}
              onClick={(): void => onDelete(scope)}
            >
              {scope}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScopesList;
