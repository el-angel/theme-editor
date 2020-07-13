import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import languageState from '~/state/language';
import { getModalState } from '~/state/modal';
import { themeStyle } from '~/state/theme';

import Item from '~/containers/StatusBar/components/Item';

import LanguageSwitcher from '~/components/LanguageSwitcher';
import ThemeStyleSwitcher from '~/components/ThemeStyleSwitcher';

import { Languages } from '~/services/language';

import css from './styles.module.scss';

const StatusBar: React.FC = () => {
  const [languageOpen, openLanguageSwitcher] = useRecoilState(getModalState('language'));
  const [themeStyleOpen, openThemeStyleSwitcher] = useRecoilState(getModalState('themeStyle'));

  const language = useRecoilValue(languageState);
  const [style] = useRecoilState(themeStyle);

  return (
    <>
      <LanguageSwitcher />
      <ThemeStyleSwitcher />
      <div className={css.container}>
        <div className="left">main*</div>

        <div className="right">
          <Item
            onClick={(): void => openThemeStyleSwitcher(!themeStyleOpen)}
          >{`Style: ${style}`}</Item>
          <Item onClick={(): void => openLanguageSwitcher(!languageOpen)}>
            {Languages[language]}
          </Item>
          <Item>
            <a
              className={css.c_est_moi}
              href="http://github.com/el-angel"
              target="_blank"
              rel="noopener noreferrer"
            >
              el angel @ github
            </a>
          </Item>
        </div>
      </div>
    </>
  );
};

export default StatusBar;
