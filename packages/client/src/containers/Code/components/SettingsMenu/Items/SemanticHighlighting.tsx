import React from 'react';
import cx from 'classnames';

import { States, useSemanticHighlighting } from '~/state/semanticTokens';

import SettingsMenuItem from '~/containers/Code/components/SettingsMenu/Item';

import css from './styles.module.scss';

const classMap = {
    [States.Active]: 'active',
    [States.Inactive]: 'inactive',
    [States.Enabled]: 'enabled',
    [States.Loading]: 'loading',
};

const SemanticHighlighting: React.FC = () => {
    const [state, toggleSemanticHighlighting] = useSemanticHighlighting();

    React.useEffect(() => {
        toggleSemanticHighlighting(States.Active);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
