import { useRecoilCallback } from 'recoil';

import { getRule, ruleIds } from '~/state/rules';
import { semanticTokenIds, semanticTokenState } from '~/state/semanticTokens';

import { confirm } from '~/services/dialog';

import { EntityType } from '~/constants';

import createRule from '~/model/rule';
import createSemanticToken from '~/model/semanticToken';

import { Rule, SemanticToken } from '~/types';

const useAddEntity = () => {
    const addEntity = useRecoilCallback(
        ({ set, snapshot }) => async <T>({
            input,
            filterScope = false,
            type,
        }): Promise<T | undefined> => {
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
                const existingIds = await snapshot.getPromise(semanticTokenIds);
                let entity;
                try {
                    entity = createSemanticToken(<Partial<SemanticToken>>input, {
                        existingIds,
                    });
                } catch (_e) {
                    confirm(_e.message);
                    return;
                }

                set(semanticTokenState(entity.id), entity);
            }

            return entity;
        },
        [],
    );

    return addEntity;
};

export default useAddEntity;
