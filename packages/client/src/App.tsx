import React from 'react';
import { initialize } from '@anche/textmate-grammar-parser';
import { RecoilRoot } from 'recoil';

import { rawCode } from '~/state/code';
import { getGeneralScope } from '~/state/generalScopes';
import { getRule, ruleIds, RULES_STATE_ID } from '~/state/rules';
import { SEMANTIC_STATE_ID, semanticTokenIds, semanticTokenState } from '~/state/semanticTokens';
import { themeStyle } from '~/state/theme';

import Code from '~/containers/Code';
import SettingsMenu from '~/containers/Code/components/SettingsMenu';
import Settings from '~/containers/Settings';
import Sidebar from '~/containers/Sidebar';
import StatusBar from '~/containers/StatusBar';

import storage from '~/services/storage';

import { atomKey } from '~/helpers/state';

import { GeneralScope, Rule, SemanticToken } from '~/types';

import css from './App.module.scss';

const ONIGASM_URL = `${process.env.PUBLIC_URL}/onigasm.wasm`;

const initializeState = ({ set }): void => {
    const keys = storage.keys();

    const ruleIdsArr = storage.get<string[]>(atomKey(RULES_STATE_ID, 'Ids')) || [];
    set(ruleIds, ruleIdsArr);

    const tokenIdsArr = storage.get<string[]>(atomKey(SEMANTIC_STATE_ID, 'Ids')) || [];
    console.log({ tokenIdsArr });
    set(semanticTokenIds, tokenIdsArr);

    for (const key of keys) {
        if (key.includes(atomKey(RULES_STATE_ID, 'id__'))) {
            const value = storage.get<Rule>(key)!;

            if (ruleIdsArr.includes(value.id)) {
                set(getRule(value.id), value);
            }
            continue;
        }

        console.log(key);
        if (key.includes(atomKey(SEMANTIC_STATE_ID, 'id__'))) {
            console.log('yo bitch');
            const value = storage.get<SemanticToken>(key)!;

            if (tokenIdsArr.includes(value.id)) {
                set(semanticTokenState(value.id), value);
            }
            continue;
        }

        if (key.includes(atomKey('GeneralScopes', 'Family'))) {
            const scope = storage.get<GeneralScope>(key)!;
            set(getGeneralScope(scope.id), scope);
            continue;
        }

        if (key.includes(atomKey('Code', 'Raw'))) {
            const code = storage.get<string>(key)!;
            set(rawCode, code);
            continue;
        }

        if (key.includes(atomKey('Theme', 'Style'))) {
            const theme = storage.get<'light' | 'dark'>(key);
            set(themeStyle, theme);
            continue;
        }
    }
};

const App: React.FC = () => {
    const [ready, setReady] = React.useState(false);

    React.useEffect(() => {
        const body = document.querySelector('body');
        if (body) {
            body.setAttribute('style', `overflow: hidden`);
        }

        if (!ready) {
            (async (): Promise<void> => {
                await initialize(ONIGASM_URL);
                setReady(true);
            })();
        }
    }, [ready]);

    if (!ready) {
        return <div>starting up...</div>;
    }

    return (
        <RecoilRoot initializeState={initializeState}>
            <>
                <div className={css.container}>
                    <div className={css.sidebar}>
                        <Sidebar />
                    </div>
                    <div className={css.main}>
                        <div className={css.settings}>
                            <SettingsMenu />
                        </div>
                        <div className={css.code}>
                            <Code />
                        </div>
                        <div className={css.bottom}>
                            <Settings />
                        </div>
                    </div>
                    <div className={css.statusbar}>
                        <StatusBar />
                    </div>
                </div>
            </>
        </RecoilRoot>
    );
};

export default App;
