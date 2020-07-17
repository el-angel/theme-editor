import { Rule } from '~/types';

interface Match {
    query: string;
    parents: string[];
    scope: string;
    matchIndexes: number[];
}

interface RuleMatch {
    rule: Rule;
    query: string;
}

const _isDescendant = (query: string, scope: string): boolean => {
    if (query === scope) {
        return true;
    }

    /**
     * query = meta.tag
     * scope = meta.tag-without-attributes,
     * this should not match, so we affix query with a ".", so we know
     * it's a correct match
     *
     * i.e.:
     * query = meta.tag
     * scope = meta.tag.tsx
     * this should match
     */
    const affix = query + '.';

    return affix === scope.substr(0, affix.length);
};

const _create = (query: string, scopes: string[]): Nullable<Match> => {
    const _scopes = [...scopes];

    const queryScopes = query.split(/ /g);

    const matchIndexes: number[] = [];
    let runner = 0;
    const passed = queryScopes.every(query => {
        return [..._scopes].some(scope => {
            const match = _isDescendant(query, scope);

            _scopes.splice(0, 1);

            if (match) {
                matchIndexes.push(runner);
            }

            runner++;

            return match;
        });
    });

    if (passed) {
        return {
            query,
            scope: queryScopes.pop()!,
            parents: queryScopes,
            matchIndexes,
        };
    }

    return null;
};

const _compare = (a: Match, b: Match): number => {
    // longer scope wins
    // meta.block.tsx > meta.block
    if (a.scope !== b.scope) {
        return a.scope.length - b.scope.length;
    }

    // scopes are equal, compare parents length
    if (a.parents.length !== b.parents.length) {
        return a.parents.length - b.parents.length;
    }

    for (let i = 0; i < a.parents.length; i++) {
        if (a.parents[i] !== b.parents[i]) {
            return a.parents[i].length - b.parents[i].length;
        }
    }

    return 0;
};

export const _match = (queries: string[], scopes: string[]): Nullable<Match> => {
    let winner: Nullable<Match> = null;

    queries.forEach(query => {
        const candidate = _create(query, scopes);

        if (!candidate) {
            return;
        }

        if (!winner) {
            winner = candidate;
            return;
        }

        const winnerLast = winner.matchIndexes[winner.matchIndexes.length - 1];
        const candidateLast = candidate.matchIndexes[candidate.matchIndexes.length - 1];

        if (candidateLast > winnerLast) {
            winner = candidate;
            return;
        }

        if (winnerLast === candidateLast) {
            if (_compare(candidate, winner) > 0) {
                winner = candidate;
            }
        }
    });

    return winner as Nullable<Match>;
};

const ruleMatch = (rules: Rule[], scopes: string[]): Nullable<RuleMatch> => {
    const queries = rules.reduce((acc: string[], rule) => [...acc, ...rule.scope], []);

    const match = _match(queries, scopes);

    let rule: Nullable<Rule> = null;

    rules.some(_rule => {
        if (match?.query && _rule.scope.includes(match.query)) {
            rule = _rule;
            return true;
        }

        return false;
    });

    if (rule) {
        return {
            rule,
            query: match!.query,
        };
    }

    return null;
};

export default ruleMatch;
