import React from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import generalScopeManager from '~/state/generalScopes';

import Open from '~/containers/Code/components/SettingsMenu/Items/Open';

import useOutsideClick from '~/hooks/useOutsideClick';

import getContrastColor from '~/helpers/getContrastColor';

import { GeneralScope } from '~/types';

import CustomizeCode from './Items/CustomizeCode';
import Export from './Items/Export';
import New from './Items/New';
import SemanticHighlighting from './Items/SemanticHighlighting';

import css from './styles.module.scss';

const SettingsMenu: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const editorBackground: GeneralScope = useRecoilValue(
        generalScopeManager('editor.background'),
    ) as GeneralScope;
    const containerRef = React.useRef<HTMLDivElement>(null);

    useOutsideClick(containerRef, (isOutside: boolean) => {
        if (isOutside && open) {
            setOpen(false);
        }
    });

    return (
        <div className={css.container}>
            <div className={css.settingsIcon} onClick={(): void => setOpen(!open)}>
                <SettingsIcon
                    style={{
                        color: getContrastColor(editorBackground.color),
                        opacity: '0.5',
                    }}
                />
            </div>

            <div
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                ref={containerRef}
                className={cx(css.menu, {
                    [css.open]: open,
                })}
            >
                <ul>
                    <New />
                    <Open />
                    <li className={css.divider}></li>
                    <SemanticHighlighting />
                    <CustomizeCode />
                    <li className={css.divider}></li>
                    <Export />
                </ul>
            </div>
        </div>
    );
};

export default SettingsMenu;
