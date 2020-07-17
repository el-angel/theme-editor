import { GENERAL_SCOPES } from '~/constants';

type Scopes = typeof GENERAL_SCOPES[number];

type Defaults = {
    [key in Scopes]: {
        [key in 'light' | 'dark']: string;
    };
};

const colors = (light: string, dark: string): { light: string; dark: string } => ({ light, dark });

const generalScopesDefault: Defaults = {
    'button.background': colors('#e36d6d', '#e36d6d'),
    'button.foreground': colors('#333333', '#333333'),
    'button.hoverBackground': colors('#b74e4e', '#b74e4e'),
    'editor.background': colors('#ffffff', '#1c1c1c'),
    'editor.foreground': colors('#333333', '#ffffff'),
    'editor.selectionBackground': colors('#f2d0a1', '#efafaf'),
    'editor.selectionForeground': colors('#333333', '#ffffff'),
    'editorGutter.background': colors('ffffff', '#1c1c1c'),
    'editorLineNumber.foreground': colors('#cccccc', '#585858'),
    focusBorder: colors('#e8e8e8', '#171717'),
    foreground: colors('#333333', '#eeeeee'),
    'input.background': colors('#ffffff', '#2c2c2b'),
    'input.border': colors('#d9d9d9', '#141414'),
    'input.foreground': colors('#333333', '#ffffff'),
    'input.placeholderForeground': colors('#999999', '#737373'),
    'list.focusBackground': colors('#d1d1d1', '#525252'),
    'list.focusForeground': colors('#333333', '#cfcfcf'),
    'list.hoverBackground': colors('#5c5c5c', '#525252'),
    'list.hoverForeground': colors('#333333', '#eeeeee'),
    'panel.background': colors('#ffffff', '#2a2828'),
    'panel.border': colors('#d9d9d9', '#141414'),
    'quickInput.background': colors('#f5f5f5', '#242424'),
    'quickInput.foreground': colors('#545454', '#ffffff'),
    'sideBar.background': colors('#ffffff', '#111111'),
    'sideBar.border': colors('#d9d9d9', '#121212'),
    'sideBar.foreground': colors('#333333', '#f9f9f9'),
    'statusBar.background': colors('#242424', '#1a1a1a'),
    'statusBar.border': colors('#878787', '#000000'),
    'statusBar.foreground': colors('#ffffff', '#eeeeee'),
    'statusBarItem.activeBackground': colors('#777777', '#333333'),
    'statusBarItem.hoverBackground': colors('#313131', '#666666'),
};

export default generalScopesDefault;
