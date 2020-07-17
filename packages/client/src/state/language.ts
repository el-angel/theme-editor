import { atom, selector } from 'recoil';

import { Languages } from '~/services/language';

import { atomKey, selectorKey } from '~/helpers/state';

export const languageState = atom<keyof typeof Languages>({
    key: atomKey('Language'),
    default: 'source.tsx',
});

export const readibleLanguage = selector({
    key: selectorKey('ReadibleLanguage'),
    get: ({ get }) => {
        const language = get(languageState);
        return Languages[language];
    },
});

export default languageState;
