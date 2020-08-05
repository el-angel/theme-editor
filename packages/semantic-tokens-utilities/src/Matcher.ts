import createToken from './CreateToken';
import { Token, TokenWinner, TokenFallback } from '~/types';
import { TOKEN_TYPE_WILDCARD } from './constants';
import { getTokenFallbackScopes } from './FallbackScopes';

let typeHierarchy = {};
const getTypeHierarchy = (typeId: string): string[] => {
    let hierarchy = typeHierarchy[typeId];
    if (!hierarchy) {
        typeHierarchy[typeId] = hierarchy = [typeId];
    }
    return hierarchy;
};

const getTokenScore = (queryToken: Token, token: Token): number => {
    let score = 0;
    if (queryToken.language !== undefined) {
        if (queryToken.language !== token.language) {
            return -1;
        }
        score += 10;
    }
    if (queryToken.type !== TOKEN_TYPE_WILDCARD) {
        const hierarchy = getTypeHierarchy(token.type);
        const level = hierarchy.indexOf(queryToken.type);

        if (level === -1) {
            return -1;
        }
        score += 100;
    }

    // all token modifiers must be present
    for (const tokenModifier of queryToken.modifiers) {
        if (token.modifiers.indexOf(tokenModifier) === -1) {
            return -1;
        }
    }

    return score + queryToken.modifiers.length * 100;
};

export const getMatch = <T extends Token>(
    token: Token,
    semanticTokens: T[],
): TokenWinner<T> | undefined => {
    let winner: TokenWinner<T> = undefined;

    semanticTokens.forEach(semanticToken => {
        const score = getTokenScore(token, semanticToken);

        if (score > (winner?.score || 0)) {
            winner = {
                token: semanticToken,
                score,
            };
        }
    });

    typeHierarchy = {};

    return winner;
};

export const getFallback = (token: Token): TokenFallback | undefined => {
    let winner: { token: TokenFallback; score: number } | undefined = undefined;

    getTokenFallbackScopes().forEach(tokenDefault => {
        const score = getTokenScore(token, tokenDefault.token);

        if (score > (winner?.score || 0)) {
            winner = {
                token: tokenDefault,
                score,
            };
        }
    });
    return winner?.token;
};

export const matchToken = <T extends Token>(
    token: string | Token,
    semanticTokens: T[],
): { token?: T; fallbackScopes?: string[] } | undefined => {
    const _token = typeof token === 'string' ? createToken(token) : token;

    const winner = getMatch(_token, semanticTokens);

    if (winner) {
        return {
            token: winner.token,
        };
    }

    const fallback = getFallback(_token);

    if (fallback) {
        return {
            fallbackScopes: fallback.fallbackScopes,
        };
    }
};
