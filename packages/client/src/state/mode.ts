import { atom, selector } from 'recoil';

import editGeneralScopeState from '~/state/generalScopes/edit';
import editRuleState from '~/state/rules/edit';

import { atomKey, selectorKey } from './../helpers/state';

type Mode = 'rules' | 'general';

const _mode = atom<Mode>({
    key: atomKey('Mode'),
    default: 'rules',
});

const mode = selector<Mode>({
    key: selectorKey('Mode'),
    get: ({ get }) => get(_mode),
    set: ({ set }, newMode) => {
        set(editRuleState, '');
        set(editGeneralScopeState, '');

        set(_mode, newMode);
    },
});

export default mode;
