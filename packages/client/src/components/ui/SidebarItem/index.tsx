import React from 'react';
import cx from 'classnames';

import css from './styles.module.scss';

interface Props {
    isActive: boolean;
    onClick?: () => void;
    title: string;
    color: string;
    showWarning?: boolean;
}

const SidebarItem: React.FC<Props> = ({
    isActive,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick = (): void => {},
    title,
    color,
    showWarning = false,
}) => {
    return (
        <div
            className={cx(css.container, {
                [css.active]: isActive,
            })}
            onClick={onClick}
        >
            <div>
                {showWarning && <span className={css.warning}>❗️</span>}
                <code className={css.name}>{title}</code>
            </div>
            <div className={css.color} style={{ backgroundColor: color }}></div>
        </div>
    );
};

export default SidebarItem;
