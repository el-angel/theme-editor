import React from 'react';
import ReactDOM from 'react-dom';
import { uniqueId } from 'lodash';

import Confirm from '~/components/ui/Confirm';
import { _Modal } from '~/components/ui/Modal';

type ModalProps = React.ComponentProps<typeof _Modal>;

export const dialogRootElement = document.querySelector('#modal');

export const createDialogElement = (): HTMLDivElement => {
    const id = uniqueId();
    const dialog = document.createElement('div');
    dialog.setAttribute('id', `dialog__${id}`);
    dialog.setAttribute('data-dialog-id', id);

    return dialog;
};

const _unmountWrap = (elem: HTMLDivElement, callback?: () => void) => (): void => {
    callback && callback();
    ReactDOM.unmountComponentAtNode(elem);
    dialogRootElement?.removeChild(elem);
};

export const confirm = (_content?: React.ReactNode): Promise<void> => {
    const elem = createDialogElement();
    const props: ModalProps = {
        onClose: _unmountWrap(elem),
        closeOnOutsideClick: true,
        overlay: true,
        position: 'center',
    };

    return new Promise((resolve, reject) => {
        const content = (
            <_Modal {...props}>
                <Confirm
                    onConfirm={_unmountWrap(elem, resolve)}
                    onReject={_unmountWrap(elem, reject)}
                >
                    {_content || 'Are you sure?'}
                </Confirm>
            </_Modal>
        );

        ReactDOM.render(content, elem);
        dialogRootElement?.appendChild(elem);
    });
};

export default {
    confirm,
};
