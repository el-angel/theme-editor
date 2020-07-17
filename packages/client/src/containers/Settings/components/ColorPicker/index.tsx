import React from 'react';
import ColorTextIcon from '@material-ui/icons/FormatColorText';
import chroma from 'chroma-js';
import { debounce } from 'lodash';

import getContrastColor from '~/helpers/getContrastColor';

import css from './styles.module.scss';

interface Props {
    onChange: (color: string) => void;
    value: string;
}

const ColorPicker: React.FC<Props> = ({ onChange, value }) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const newColorCallback = React.useCallback(
        debounce((color: string) => {
            onChange(color);
        }, 100),
        [onChange],
    );

    const _onChange = React.useCallback(
        evt => {
            newColorCallback(evt.target.value);
        },
        [newColorCallback],
    );

    return (
        <div className={css.container}>
            <div
                onClick={(): void => inputRef.current?.click()}
                className={css.hexValue}
                style={{ backgroundColor: value, color: getContrastColor(value) }}
            >
                {value}
            </div>
            <div onClick={(): void => inputRef.current?.click()} className={css.picker}>
                <ColorTextIcon />
            </div>
            <input
                className={css.input}
                ref={inputRef}
                type="color"
                value={value}
                onChange={_onChange}
            />
        </div>
    );
};

export default ColorPicker;
