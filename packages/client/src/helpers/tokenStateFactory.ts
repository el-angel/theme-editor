import {
    atom,
    atomFamily,
    DefaultValue,
    RecoilValueReadOnly,
    selector,
    selectorFamily,
} from 'recoil';

import storage from '~/services/storage';

import { EntityType } from '~/constants';

import { atomKey, selectorKey } from '~/helpers/state';

import { Base } from '~/types';

interface Options<T extends Base<EntityType>> {
    state: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: T | ((param: any) => RecoilValueReadOnly<T>);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const factory = <T extends Base>(opts: Options<T>) => {
    const { state, default: _default } = opts;

    const TREE_ID = state.toUpperCase();

    /**
     * ids
     */
    const _idState = atom<string[]>({
        key: atomKey(TREE_ID, 'Ids'),
        default: [],
    });

    const entityIds = selector<string[]>({
        key: selectorKey(TREE_ID, 'Ids_SEL'),
        get: ({ get }) => get(_idState),
        set: ({ set }, input) => {
            set(_idState, input || []);
            storage.set(atomKey(TREE_ID, 'Ids'), input || []);
        },
    });

    /**
     * State
     */
    const _state = atomFamily<T, string>({
        key: atomKey(TREE_ID, 'State'),
        default: _default,
    });

    const getEntities = selector<T[]>({
        key: selectorKey(TREE_ID, 'All'),
        get: ({ get }) => {
            const idArr = get(entityIds);

            const state = idArr.map(id => get(getEntity(id)));

            return state;
        },
    });

    const getEntity = selectorFamily<T, Maybe<string>>({
        key: selectorKey(TREE_ID, 'Entity'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        get: id => ({ get }): Maybe<T> => {
            if (!id) {
                return undefined;
            }

            const state = get(_state(id));
            return state;
        },
        set: id => ({ set, get }, input): void => {
            if (!id) {
                return;
            }

            if (input instanceof DefaultValue) {
                set(_state(id), input);
                return;
            }

            const entity = _state(id);

            const idArr = get(entityIds);

            // new entity
            if (!idArr.includes(id)) {
                set(entityIds, [...idArr, id]);
            }

            // delete entity
            if (input?.__meta?.state === 'deleted') {
                set(
                    entityIds,
                    idArr.filter(_id => _id !== id),
                );

                /**
                 * @TODO Replace when Atom Effects is introduced
                 */
                storage.remove(atomKey(TREE_ID, `id__"${id}"`));
                return;
            }

            set(entity, {
                ...input,
                id,
                __meta: {
                    touched: true,
                    ...input.__meta,
                },
            });

            /**
             * @TODO Replace when Atom Effects is introduced
             */
            storage.set(atomKey(TREE_ID, `id__"${id}"`), get(entity));
        },
    });

    return {
        TREE_ID,
        entityIds,
        getEntities,
        getEntity,
    };
};

export default factory;
