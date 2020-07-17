import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { createDialogElement, dialogRootElement } from '~/services/dialog';

import useOutsideClick from '~/hooks/useOutsideClick';

import css from './styles.module.scss';

interface Props {
    onClose: () => void;
    closeOnOutsideClick?: boolean;
    position?: 'top' | 'center';
    overlay?: boolean;
}

export const _Modal: React.FC<Props> = ({
    children,
    onClose,
    closeOnOutsideClick,
    position = 'top',
    overlay,
}) => {
    const ref = React.useRef<HTMLDivElement>(null);

    useOutsideClick(ref, (isOutside: boolean) => {
        if (isOutside && closeOnOutsideClick) {
            onClose();
        }
    });

    return (
        <>
            <div ref={ref} className={cx(css.container, css[position])}>
                {children}
            </div>
            {overlay && <div className={css.overlay} />}
        </>
    );
};

const Modal: React.FC<Props & { target?: HTMLDivElement }> = ({
    children,
    target = createDialogElement(),
    ...props
}) => {
    React.useEffect(() => {
        dialogRootElement?.appendChild(target);
        return (): void => {
            dialogRootElement?.removeChild(target);
        };
    }, [target]);

    return ReactDOM.createPortal(<_Modal {...props}>{children}</_Modal>, target);
};

export default Modal;
