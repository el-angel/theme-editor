import { Rule } from '~/types';

const getDefinedScopes = (rules: Rule[]): string[] => {
    let scopes: string[] = [];

    for (let i = 0; i < rules.length; i++) {
        scopes = [...scopes, ...rules[i].scope];
    }

    return scopes;
};

const isDefined = (selector: string, scopes: string[]): boolean => {
    const occurrences = scopes.filter(scope => scope === selector).length;

    return occurrences >= 2;
};

const getExistingScopes = (rule: Rule, rules: Rule[]): string[] => {
    if (!rule.scope.length || !rules.length) {
        return [];
    }

    const scopes = getDefinedScopes(rules);
    if (!scopes.length) {
        return [];
    }

    return rule.scope.reduce((acc: string[], scope: string) => {
        if (isDefined(scope, scopes)) {
            return [...acc, scope];
        }
        return acc;
    }, []);
};

export default getExistingScopes;
