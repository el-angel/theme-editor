import React from 'react';
import cx from 'classnames';

import css from './styles.module.scss';

interface Props {
    children: string;
    onClick: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<Props> = ({ children, onClick }) => {
    return (
        <button type="button" className={cx(css.button)} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
