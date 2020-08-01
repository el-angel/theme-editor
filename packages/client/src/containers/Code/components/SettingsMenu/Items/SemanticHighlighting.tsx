import React from 'react';
import cx from 'classnames';
import { useRecoilCallback, useRecoilValue } from 'recoil';

import { semanticState, States } from '~/state/semanticTokens';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import API from '~/services/api';

import css from './styles.module.scss';

const classMap = {
    [States.Active]: 'active',
    [States.Inactive]: 'inactive',
    [States.Enabled]: 'enabled',
    [States.Loading]: 'loading',
};

const SemanticHighlighting: React.FC = () => {
    const state = useRecoilValue(semanticState);
    const toggleSemanticHighlighting = useRecoilCallback(({ set }) => (): void => {
        if (state === States.Loading) {
            return;
        }

        if (state === States.Active) {
            set(semanticState, States.Inactive);
            return;
        }

        set(semanticState, States.Loading);

        API.ping()
            .then(() => {
                set(semanticState, States.Active);
            })
            .catch(() => {
                set(semanticState, States.Enabled);
            });
    });

    return (
        <SettingsMenuItem onClick={toggleSemanticHighlighting}>
            <div className={cx(css.container, css[classMap[state]])}>
                <div>Semantic highlighting</div>
                <div className={css.status} />
            </div>
        </SettingsMenuItem>
    );
};
export default SemanticHighlighting;
