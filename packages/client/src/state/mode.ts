import { atom, selector } from 'recoil';

import { entitySettingsState } from '~/state/ui';

import { atomKey, selectorKey } from '~/helpers/state';

import { EntityType } from './../constants/index';

const _mode = atom<EntityType>({
    key: atomKey('Mode', '_'),
    default: EntityType.Rule,
});

const mode = selector<EntityType>({
    key: selectorKey('Mode', 'Value'),
    get: ({ get }) => get(_mode),
    set: ({ set }, newMode) => {
        set(entitySettingsState, undefined);

        set(_mode, newMode);
    },
});

export default mode;
