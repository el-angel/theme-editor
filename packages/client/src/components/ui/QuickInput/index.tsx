import React from 'react';
import cx from 'classnames';

import css from './styles.module.scss';

interface Option {
    label: string;
    value: string;
}

interface Props<T extends Option> {
    children?: React.ReactNode;
    options: T[];
    onSelect: (option: T) => void;
    onClose: () => void;
    value: T['value'];
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const QuickInput = <T extends Option>({
    value,
    options,
    onSelect,
    onClose,
    inputProps,
}: Props<T>): React.ReactElement => {
    const index = options.findIndex(option => option.value === value);
    const [focussedIndex, setFocussedIndex] = React.useState(index);

    const keydownHandler = React.useCallback(
        (event: KeyboardEvent) => {
            if (!['Enter', 'ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) {
                return;
            }

            event.preventDefault();

            if (event.key == 'Escape') {
                onClose();
            }

            if (event.key === 'Enter') {
                onSelect(options[focussedIndex]);
            }

            if (event.key === 'ArrowUp') {
                if (focussedIndex === 0) {
                    setFocussedIndex(options.length - 1);
                    return;
                }

                setFocussedIndex(focussedIndex - 1);
                return;
            }

            if (event.key === 'ArrowDown') {
                if (focussedIndex === options.length - 1) {
                    setFocussedIndex(0);
                    return;
                }

                setFocussedIndex(focussedIndex + 1);
                return;
            }
        },
        [focussedIndex, onClose, onSelect, options],
    );

    React.useEffect(() => {
        window.addEventListener('keydown', keydownHandler);

        return (): void => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [focussedIndex, keydownHandler]);

    return (
        <div className={css.container}>
            <div className={css.inputContainer}>
                <input {...inputProps} className={css.input} />
            </div>
            <div className={css.optionContainer}>
                {options.map((option, i) => (
                    <div
                        onClick={(): void => onSelect(option)}
                        className={cx(css.option, {
                            [css.focussed]: focussedIndex === i,
                        })}
                        key={option.value}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickInput;
