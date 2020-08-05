import { TextMateRule } from '~/types';

interface Match {
    query: string;
    parents: string[];
    scope: string;
    matchIndexes: number[];
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

const _createCandidate = (nodeScopes: string[], query: string): Match | null => {
    const _scopes = [...nodeScopes];

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

const scopeMatch = (nodeScopes: string[], definedScopes: string[]): Match | null => {
    let winner: Match | null = null;

    let i = 0;
    const length = definedScopes.length;

    for (; i < length; i++) {
        const candidate = _createCandidate(nodeScopes, definedScopes[i]);

        if (!candidate) {
            continue;
        }

        if (!winner) {
            winner = candidate;
            continue;
        }

        const winnerLast = winner.matchIndexes[winner.matchIndexes.length - 1];
        const candidateLast = candidate.matchIndexes[candidate.matchIndexes.length - 1];

        if (candidateLast > winnerLast) {
            winner = candidate;
            continue;
        }

        if (winnerLast === candidateLast) {
            if (_compare(candidate, winner) > 0) {
                winner = candidate;
            }
        }
    }

    return winner as Match | null;
};

const match = <T extends TextMateRule>(nodeScopes: string | string[], rules: T[]): T | null => {
    const _nodeScopes = typeof nodeScopes === 'string' ? [nodeScopes] : nodeScopes;

    let queries: string[] = [];

    let i = 0;
    const length = rules.length;

    for (; i < length; i++) {
        queries = [...queries, ...rules[i].scopes];
    }

    const match = scopeMatch(_nodeScopes, queries);

    if (!match) {
        return null;
    }

    let rule: T | null = null;

    rules.some(_rule => {
        if (_rule.scopes.includes(match.query)) {
            rule = _rule;
            return true;
        }

        return false;
    });

    return rule;
};

export default match;
