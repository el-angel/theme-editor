import React from 'react';
import { useRecoilState } from 'recoil';

import languageState from '~/state/language';
import { getModalState } from '~/state/modal';

import Modal from '~/components/ui/Modal';
import QuickInput from '~/components/ui/QuickInput';

import { Languages } from '~/services/textmate';

interface Option {
    value: keyof typeof Languages;
    label: typeof Languages[keyof typeof Languages];
}

const options: Option[] = Object.keys(Languages).map(language => ({
    value: language as keyof typeof Languages,
    label: Languages[language],
}));

const LanguageSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useRecoilState(getModalState('language'));
    const [language, setLanguage] = useRecoilState(languageState);

    if (!isOpen) {
        return null;
    }

    const onSelect = (option: Option): void => {
        setLanguage(option.value);
        setIsOpen(false);
    };

    return (
        <Modal closeOnOutsideClick onClose={(): void => setIsOpen(false)}>
            <QuickInput
                value={language}
                options={options}
                onSelect={onSelect}
                onClose={(): void => setIsOpen(false)}
                inputProps={{
                    placeholder: 'Select language mode',
                    readOnly: true,
                }}
            />
        </Modal>
    );
};

export default LanguageSwitcher;
