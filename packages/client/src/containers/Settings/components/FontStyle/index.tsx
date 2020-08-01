import React from 'react';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlineIcon from '@material-ui/icons/FormatUnderlined';
import cx from 'classnames';

import { FontStyle as FontStyleEnum } from '~/constants';

import css from './styles.module.scss';

const TYPE_MAP = {
    [FontStyleEnum.Bold]: BoldIcon,
    [FontStyleEnum.Italic]: ItalicIcon,
    [FontStyleEnum.Underline]: UnderlineIcon,
};

interface Props {
    type: FontStyleEnum;
    onClick: () => void;
    enabled: boolean;
}

const FontStyle: React.FC<Props> = ({ type, onClick, enabled }) => {
    const SVG = TYPE_MAP[type];

    return (
        <div onClick={onClick} className={cx(css.icon, { [css.enabled]: enabled })}>
            <SVG />
        </div>
    );
};

export default FontStyle;
