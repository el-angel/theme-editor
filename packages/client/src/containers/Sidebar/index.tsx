import React from 'react';
import { useRecoilValue } from 'recoil';

import mode from '~/state/mode';

import Info from '~/containers/Code/components/Info';
import FilterAdd from '~/containers/Sidebar/components/FilterAdd';
import GeneralScopes from '~/containers/Sidebar/components/GeneralScopes';
import Rules from '~/containers/Sidebar/components/Rules';
import SemanticTokens from '~/containers/Sidebar/components/SemanticTokens';
import Toolbar from '~/containers/Sidebar/components/Toolbar';

import { EntityType } from '~/constants';

import css from './styles.module.scss';

import generalScopesStateCSS from '~/selectors/generalScopeCSS';

const Sidebar: React.FC = () => {
    const currentMode = useRecoilValue(mode);
    const generalStyle = useRecoilValue(generalScopesStateCSS);

    return (
        <>
            <div>
                <Toolbar />
            </div>
            <FilterAdd />
            <div className={css.content}>
                <style type="text/css">{generalStyle}</style>
                <div className={css.rules}>
                    {currentMode === EntityType.Rule && <Rules />}

                    {currentMode === EntityType.GeneralScope && <GeneralScopes />}

                    {currentMode === EntityType.SemanticToken && <SemanticTokens />}
                </div>
                <Info />
            </div>
        </>
    );
};

export default Sidebar;
