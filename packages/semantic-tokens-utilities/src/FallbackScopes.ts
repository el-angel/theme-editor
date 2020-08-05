import { tokenTypes, tokenModifiers } from './constants/tokens';
import { Token, TokenFallback } from './types';
import createToken from './CreateToken';

const _tokenFallbackScopes: TokenFallback[] = [];

const _isValid = (token: Token): boolean => {
    if (!tokenTypes.some(tokenType => tokenType === token.type)) {
        return false;
    }

    if (
        token.modifiers &&
        !token.modifiers.every(mod => tokenModifiers.some(tokenMod => tokenMod === mod))
    ) {
        return false;
    }

    return true;
};

export const registerTokenFallback = (tokenString: string, fallbackScopes: string[]): void => {
    const token = createToken(tokenString);

    if (!_isValid(token)) {
        throw new Error(
            `${tokenString} is not a valid token. Either the pattern or type/modifier is invalid.`,
        );
    }

    _tokenFallbackScopes.push({
        token,
        fallbackScopes,
    });
};

export const getTokenFallbackScopes = (): TokenFallback[] => {
    return _tokenFallbackScopes;
};
