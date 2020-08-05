import React from 'react';
import cx from 'classnames';
import { useRecoilState } from 'recoil';

import mode from '~/state/mode';

import { EntityType } from '~/constants';

import css from './styles.module.scss';

const Toolbar: React.FC = () => {
    const [currentMode, setMode] = useRecoilState(mode);

    return (
        <div className={css.toolbar}>
            <div className={css.header}>
                <div
                    className={cx(css.item, {
                        [css.isActive]: currentMode === EntityType.Rule,
                    })}
                    onClick={(): void => setMode(EntityType.Rule)}
                >
                    <span>Rules</span>
                </div>
                <div
                    className={cx(css.item, {
                        [css.isActive]: currentMode === EntityType.SemanticToken,
                    })}
                    onClick={(): void => setMode(EntityType.SemanticToken)}
                >
                    <span>Semantic</span>
                </div>
                <div
                    className={cx(css.item, {
                        [css.isActive]: currentMode === EntityType.GeneralScope,
                    })}
                    onClick={(): void => setMode(EntityType.GeneralScope)}
                >
                    <span>General</span>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
