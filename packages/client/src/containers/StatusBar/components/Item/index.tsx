import React from 'react';

import css from './styles.module.scss';

interface Props {
    onClick?: () => void;
}

const Item: React.FC<Props> = ({ children, onClick }) => {
    return (
        <div onClick={onClick} className={css.item}>
            {children}
        </div>
    );
};

export default Item;
