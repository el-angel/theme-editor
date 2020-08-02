import { atom, selector } from 'recoil';

import { Languages } from '~/services/textmate';

import { atomKey, selectorKey } from '~/helpers/state';

export const languageState = atom<keyof typeof Languages>({
    key: atomKey('Language', 'lang'),
    default: 'source.tsx',
});

export const readibleLanguage = selector({
    key: selectorKey('Language', 'Processed'),
    get: ({ get }) => {
        const language = get(languageState);
        return Languages[language];
    },
});

export default languageState;
