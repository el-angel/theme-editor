import React from 'react';
import { useRecoilState } from 'recoil';

import { getModalState } from '~/state/modal';
import { themeStyle } from '~/state/theme';

import Modal from '~/components/ui/Modal';
import QuickInput from '~/components/ui/QuickInput';

interface Option {
    label: string;
    value: 'dark' | 'light';
}

const options: Option[] = [
    {
        label: 'Dark',
        value: 'dark',
    },
    {
        label: 'Light',
        value: 'light',
    },
];

const ThemeStyleSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(getModalState('themeStyle'));
    const [style, setStyle] = useRecoilState(themeStyle);

    if (!isOpen) {
        return null;
    }

    const onSelect = (option: Option): void => {
        setStyle(option.value);
        setIsOpen(false);
    };

    return (
        <Modal closeOnOutsideClick onClose={(): void => setIsOpen(false)}>
            <QuickInput
                value={style}
                options={options}
                onSelect={onSelect}
                onClose={(): void => setIsOpen(false)}
                inputProps={{
                    placeholder: 'Select theme style',
                    readOnly: true,
                }}
            />
        </Modal>
    );
};

export default ThemeStyleSwitcher;
