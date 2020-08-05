import { EntityType } from '~/constants';

import factory from '~/helpers/tokenStateFactory';

import { Rule } from '~/types';

const {
    TREE_ID: RULES_STATE_ID,
    getEntities: rulesState,
    getEntity: ruleState,
    entityIds: ruleIds,
} = factory({
    state: 'rules',
    default: <Rule>{
        id: '',
        name: '',
        scope: <string[]>[],
        settings: {
            foreground: '#000000',
            fontStyle: [],
        },
        __meta: {
            type: EntityType.Rule,
        },
    },
});

export { RULES_STATE_ID, rulesState, ruleState, ruleIds };
