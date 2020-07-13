import React from 'react';
import { useRecoilValue } from 'recoil';

import mode from '~/state/mode';

import Info from '~/containers/Code/components/Info';
import General from '~/containers/Sidebar/components/General';
import Rules from '~/containers/Sidebar/components/Rules';
import Toolbar from '~/containers/Sidebar/components/Toolbar';

import css from './styles.module.scss';

import getGeneralScopesCSS from '~/selectors/generalScopeCSS';
import { getRulesCSS } from '~/selectors/rulesCSS';

const Sidebar: React.FC = () => {
  const currentMode = useRecoilValue(mode);
  const ruleStyle = useRecoilValue(getRulesCSS);
  const generalStyle = useRecoilValue(getGeneralScopesCSS);

  return (
    <>
      <div>
        <Toolbar />
      </div>
      <div className={css.content}>
        <style type="text/css">{ruleStyle}</style>
        <style type="text/css">{generalStyle}</style>
        <div className={css.rules}>
          {currentMode === 'rules' && <Rules />}

          {currentMode === 'general' && <General />}
        </div>
        <Info />
      </div>
    </>
  );
};

export default Sidebar;