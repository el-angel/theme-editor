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

const createRule = (input: Partial<Rule> & { id: string }): Rule => {
  const rule = {
    id: input.id,
    name: createName(input),
    scope: input?.scope || [],
    settings: {
      foreground: input?.settings?.foreground || '#a0988a',
      fontStyle: input?.settings?.fontStyle || [],
    },
  };

  return rule;
};

export default createRule;
