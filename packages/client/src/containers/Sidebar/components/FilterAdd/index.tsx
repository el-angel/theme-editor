import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { useRecoilState } from 'recoil';
import { useRecoilValue } from 'recoil';

import mode from '~/state/mode';
import { filter } from '~/state/sidebar';

import Button from '~/components/ui/Button';

import useAddEntity from '~/hooks/useAddEntity';

import { EntityType } from '~/constants';

import css from './styles.module.scss';

const create = (input: string, type: EntityType) => ({
    input: {
        scope: type === EntityType.Rule ? [input] : input,
    },
    type,
});

const FilterAdd: React.FC = () => {
    const [query, setQuery] = useRecoilState(filter);
    const _mode = useRecoilValue(mode);

    const addEntity = useAddEntity();

    return (
        <div className={css.container}>
            <input
                className={css.input}
                type="text"
                value={query}
                onChange={(event): void => setQuery(event.target.value)}
                placeholder="filter/add"
            />
            {_mode !== EntityType.GeneralScope && (
                <Button className={css.addButton} onClick={() => addEntity(create(query, _mode))}>
                    <AddIcon />
                </Button>
            )}
        </div>
    );
};

export default FilterAdd;
