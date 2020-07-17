import React from 'react';
import BoldIcon from '@material-ui/icons/FormatBold';
import ItalicIcon from '@material-ui/icons/FormatItalic';
import UnderlineIcon from '@material-ui/icons/FormatUnderlined';
import cx from 'classnames';

import { FONT_STYLE } from '~/constants';

import css from './styles.module.scss';

const TYPE_MAP = {
    [FONT_STYLE.BOLD]: BoldIcon,
    [FONT_STYLE.ITALIC]: ItalicIcon,
    [FONT_STYLE.UNDERLINE]: UnderlineIcon,
};

type FontStyle = typeof FONT_STYLE[keyof typeof FONT_STYLE];

interface Props {
    type: FontStyle;
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
