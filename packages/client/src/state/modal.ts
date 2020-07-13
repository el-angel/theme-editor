import { atom, atomFamily, selectorFamily } from 'recoil';

import { atomKey, selectorKey } from '~/helpers/state';

const modalIds = atom<string[]>({
  key: atomKey('ModalIds'),
  default: [],
});

const _modalState = atomFamily({
  key: atomKey('ModalState__Family'),
  default: false,
});

export const getModalState = selectorFamily<boolean, string>({
  key: selectorKey('GetModalState__Family'),
  get: id => ({ get }): boolean => {
    return get(_modalState(id));
  },
  set: (id: string) => ({ set, get }, isOpen): void => {
    const ids = get(modalIds);

    if (!ids.includes(id)) {
      set(modalIds, [...ids, id]);
    }

    if (isOpen) {
      ids.forEach(_id => {
        if (_id !== id) {
          set(_modalState(_id), false);
        }
      });
    }

    set(_modalState(id), isOpen);
  },
});
