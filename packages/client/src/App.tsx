import React from 'react';
import { initialize } from '@anche/textmate-grammar-parser';
import { RecoilRoot } from 'recoil';

import { rawCode } from '~/state/code';
import generalScopeManager from '~/state/generalScopes';
import ruleManager, { ruleIds } from '~/state/rules';
import { themeStyle } from '~/state/theme';

import Code from '~/containers/Code';
import SettingsMenu from '~/containers/Code/components/SettingsMenu';
import Settings from '~/containers/Settings';
import Sidebar from '~/containers/Sidebar';
import StatusBar from '~/containers/StatusBar';

import storage from '~/services/storage';

import { atomKey } from '~/helpers/state';

import { GeneralScope, Rule } from '~/types';

import css from './App.module.scss';

const ONIGASM_URL = `${process.env.PUBLIC_URL}/onigasm.wasm`;

const initializeState = ({ set }): void => {
    const keys = storage.keys();

    const ids = storage.get<string[]>(atomKey('RulesIds')) || [];
    set(ruleIds, ids);

    keys.forEach(key => {
        if (key === atomKey('RulesIds')) {
            return;
        }

        if (key.includes(atomKey('Rules_'))) {
            const value = storage.get<Rule>(key)!;

            if (ids.includes(value.id)) {
                set(ruleManager(value.id), value);
            }
        }

        if (key.includes(atomKey('GeneralScopesFamily'))) {
            const scope = storage.get<GeneralScope>(key)!;
            set(generalScopeManager(scope.scope), scope);
        }

        if (key.includes(atomKey('RawCode'))) {
            const code = storage.get<string>(key)!;
            set(rawCode, code);
        }

        if (key.includes(atomKey('Theme'))) {
            const theme = storage.get<'light' | 'dark'>(key);
            set(themeStyle, theme);
        }
    });
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
