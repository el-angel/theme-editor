import React from 'react';
import cx from 'classnames';
import { useRecoilState } from 'recoil';

import mode from '~/state/mode';

import css from './styles.module.scss';

const Toolbar: React.FC = () => {
  const [currentMode, setMode] = useRecoilState(mode);

  return (
    <div className={css.toolbar}>
      <div className={css.header}>
        <div
          className={cx(css.item, {
            [css.isActive]: currentMode === 'rules',
          })}
          onClick={(): void => setMode('rules')}
        >
          Rules
        </div>
        <div
          className={cx(css.item, {
            [css.isActive]: currentMode === 'general',
          })}
          onClick={(): void => setMode('general')}
        >
          General
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
