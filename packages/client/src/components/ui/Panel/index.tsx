import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

import PanelItem from '~/components/ui/PanelItem';

import css from './styles.module.scss';

interface Props {
    onClose: () => void;
}

const Panel: React.FC<Props> = ({ children, onClose }) => {
    return (
        <div className={css.container}>
            <div className={css.toolbar}>
                <div>
                    <PanelItem>Settings</PanelItem>
                </div>
                <div>
                    <span onClick={onClose} className={css.close}>
                        <CloseIcon style={{ fontSize: '16px' }} />
                    </span>
                </div>
            </div>
            <div className={css.content}>{children}</div>
        </div>
    );
};

export default Panel;
