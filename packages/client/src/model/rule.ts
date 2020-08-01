import { uniqueId } from 'lodash';

import { EntityType } from '~/constants';

import { Rule } from '~/types';

const createName = (input?: Partial<Rule>): string => {
    if (!input) {
        return '';
    }

    if (input.name) {
        return input.name;
    }

    if (typeof input.scope === 'string') {
        return input.scope;
    }

    if (typeof input.scope === 'object' && input.scope.length) {
        return input.scope[0];
    }

    return '';
};

interface Options {
    existingIds: string[];
    filterScope?: boolean;
}

const createRule = (input: Partial<Rule>, options: Options): Rule => {
    const { existingIds, filterScope = false } = options;

    const filteredScopes = !filterScope
        ? input?.scope || []
        : (input?.scope || []).map(scope => {
              const splitted = scope.split('.');
              // remove extension from scope to support more language
              // otherwise theme will only work for this language
              splitted.pop();
              return splitted.join('.');
          });

    let id = uniqueId();

    while (existingIds.includes(id)) {
        id = uniqueId();
    }

    const rule: Rule = {
        id,
        name: createName(input),
        scope: filteredScopes,
        settings: {
            foreground: input?.settings?.foreground || '#a0988a',
            fontStyle: input?.settings?.fontStyle || [],
        },
        __meta: {
            type: EntityType.Rule,
        },
    };

    return rule;
};

export default createRule;
