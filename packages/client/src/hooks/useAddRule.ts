import { useRecoilCallback } from 'recoil';

import { getRule, ruleIds } from '~/state/rules';
import { semanticTokenIds, semanticTokenState } from '~/state/semanticTokens';

import { EntityType } from '~/constants';

import createRule from '~/model/rule';
import createSemanticToken from '~/model/semanticToken';

import { Rule, SemanticToken } from '~/types';

type AddEntityFunction<T> = (_0: {
    input: Partial<T>;
    filterScope?: boolean;
    type: EntityType.Rule | EntityType.SemanticToken;
}) => Promise<T>;

const useAddEntity = () => {
    const addEntity = useRecoilCallback(
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        ({ set, snapshot }) => async <T>({ input, filterScope, type }): Promise<T> => {
            let entity;
            if (type === EntityType.Rule) {
                const existingIds = await snapshot.getPromise(ruleIds);
                entity = createRule(<Partial<Rule>>input, {
                    existingIds,
                    filterScope: filterScope,
                });

                set(getRule(entity.id), entity);
            }

            if (type === EntityType.SemanticToken) {
                console.log('input st', input);
                const existingIds = await snapshot.getPromise(semanticTokenIds);
                entity = createSemanticToken(<Partial<SemanticToken>>input, {
                    existingIds,
                });

                set(semanticTokenState(entity.id), entity);
            }

            return entity;
        },
        [],
    );

    return addEntity;
};

export default useAddEntity;
