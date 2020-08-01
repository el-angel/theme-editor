import { atom, DefaultValue, selector } from 'recoil';

import storage from '~/services/storage';

import { atomKey, selectorKey } from '~/helpers/state';

type Theme = 'dark' | 'light';

const _themeStyle = atom<Theme>({
    key: atomKey('Theme', '_'),
    default: 'dark',
});

export const themeStyle = selector<Theme>({
    key: selectorKey('Theme', 'Style'),
    get: ({ get }) => {
        return get(_themeStyle);
    },
    set: ({ set }, _style) => {
        let style = _style;
        if (_style instanceof DefaultValue) {
            style = 'dark';
        }
        storage.set(atomKey('Theme', '_'), style);
        set(_themeStyle, style);
    },
});
