import React from 'react';
import cx from 'classnames';

import css from './styles.module.scss';

interface Props {
    children: React.ReactNode;
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
}

const Button: React.FC<Props> = ({ children, onClick, className }) => {
    return (
        <button type="button" className={cx(css.button, className)} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
