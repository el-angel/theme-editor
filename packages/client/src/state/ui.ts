import { atom, DefaultValue, selector } from 'recoil';

import mode from '~/state/mode';

import { atomKey, selectorKey } from '~/helpers/state';

import { Base } from '~/types';

const _entitySettingsState = atom<Base | undefined>({
    key: atomKey('Settings', 'Entity'),
    default: undefined,
});

export const entitySettingsState = selector<Base | undefined>({
    key: selectorKey('Settings', 'Entity'),
    get: ({ get }) => get(_entitySettingsState),
    set: ({ set }, input) => {
        if (!input || input instanceof DefaultValue) {
            set(_entitySettingsState, undefined);
            return;
        }

        set(mode, input.__meta.type);

        set(_entitySettingsState, input);
    },
});
