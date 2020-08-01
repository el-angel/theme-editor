import { SemanticToken } from '~/types';

// qualified string [type|*](.modifier)*(/language)!
export type TokenClassificationString = string;

export const TOKEN_TYPE_WILDCARD = '*';
export const TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR = ':';
export const CLASSIFIER_MODIFIER_SEPARATOR = '.';

export const idPattern = '\\w+[-_\\w+]*';
export const typeAndModifierIdPattern = `^${idPattern}$`;

export const selectorPattern = `^(${idPattern}|\\*)(\\${CLASSIFIER_MODIFIER_SEPARATOR}${idPattern})*(\\${TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR}${idPattern})?$`;

interface TokenSelector {
    type: string;
    modifiers: string[];
    language?: string;
}

interface TokenBase {
    id: string;
}

type TokenType = TokenBase;
type TokenModifier = TokenBase;

interface TokenFallback {
    selector: TokenSelector;
    fallbackScopes: string[];
}

interface TokenWinner<T> {
    score: number;
    token: T;
}

class SemanticTokenRegistry {
    private _tokenTypes: Record<TokenType['id'], TokenType> = {};
    private _tokenModifiers: Record<TokenModifier['id'], TokenModifier> = {};
    private _tokenDefaultStyles: TokenFallback[] = [];

    // constructor() {}

    public registerTokenType(id: string): void {
        if (!id.match(typeAndModifierIdPattern)) {
            throw new Error(`${id} is an invalid token type.`);
        }

        const token: TokenType = {
            id,
        };

        this._tokenTypes[id] = token;
    }

    public registerTokenModifier(id: string): void {
        if (!id.match(typeAndModifierIdPattern)) {
            throw new Error(`${id} is an invalid token modifier`);
        }

        const token: TokenModifier = {
            id,
        };

        this._tokenModifiers[id] = token;
    }

    public registerTokenStyle(querySelector: string, fallbackScopes: string[]): void {
        const selector = createQuerySelector(querySelector);

        this._tokenDefaultStyles.push({
            selector,
            fallbackScopes,
        });
    }

    public getTokenDefaultStyles(): TokenFallback[] {
        return this._tokenDefaultStyles;
    }
}

export const registry = new SemanticTokenRegistry();

const registerTokenType = (tokenType: string, fallback: string[]): void => {
    registry.registerTokenType(tokenType);
    registry.registerTokenStyle(tokenType, fallback);
};

registerTokenType('comment', ['comment']);
registerTokenType('string', ['string']);
registerTokenType('keyword', ['keyword.control']);
registerTokenType('number', ['constant.numeric']);
registerTokenType('regexp', ['constant.regexp']);
registerTokenType('operator', ['keyword.operator']);

registerTokenType('namespace', ['entity.name.namespace']);

registerTokenType('type', ['entity.name.type', 'support.type']);
registerTokenType('struct', ['entity.name.type.struct']);
registerTokenType('class', ['entity.name.type.class', 'support.class']);
registerTokenType('interface', ['entity.name.type.interface']);
registerTokenType('enum', ['entity.name.type.enum']);
registerTokenType('typeParameter', ['entity.name.type.parameter']);

registerTokenType('function', ['entity.name.function', 'support.function']);
registerTokenType('member', ['entity.name.function.member', 'support.function']);
registerTokenType('macro', ['entity.name.other.preprocessor.macro']);

registerTokenType('variable', ['variable.other.readwrite', 'entity.name.variable']);
registerTokenType('parameter', ['variable.parameter']);
registerTokenType('property', ['variable.other.property']);
registerTokenType('enumMember', ['variable.other.enummember']);
registerTokenType('event', ['variable.other.event']);

registerTokenType('label', []);

registry.registerTokenModifier('declaration');
registry.registerTokenModifier('documentation');
registry.registerTokenModifier('static');
registry.registerTokenModifier('abstract');
registry.registerTokenModifier('deprecated');
registry.registerTokenModifier('modification');
registry.registerTokenModifier('defaultLibrary');
registry.registerTokenModifier('async');
registry.registerTokenModifier('readonly');

registry.registerTokenStyle('variable.readonly', ['variable.other.constant']);
registry.registerTokenStyle('property.readonly', ['variable.other.constant.property']);
registry.registerTokenStyle('type.defaultLibrary', ['support.type']);
registry.registerTokenStyle('class.defaultLibrary', ['support.class']);
registry.registerTokenStyle('interface.defaultLibrary', ['support.class']);
registry.registerTokenStyle('variable.defaultLibrary', [
    'support.variable',
    'support.other.variable',
]);
registry.registerTokenStyle('variable.defaultLibrary.readonly', ['support.constant']);
registry.registerTokenStyle('property.defaultLibrary', ['support.variable.property']);
registry.registerTokenStyle('property.defaultLibrary.readonly', ['support.constant.property']);
registry.registerTokenStyle('function.defaultLibrary', ['support.function']);
registry.registerTokenStyle('member.defaultLibrary', ['support.function']);

export function createQuerySelector(queryString: string): TokenSelector {
    if (!queryString.match(selectorPattern)) {
        throw new Error(`${queryString} is not a valid selector.`);
    }

    let i = queryString.length,
        j = queryString.length,
        language: Maybe<string>;

    const modifiers: string[] = [];

    for (; i >= 0; i--) {
        const char = queryString[i];
        if (
            char === CLASSIFIER_MODIFIER_SEPARATOR ||
            char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR
        ) {
            const segment = queryString.substring(i + 1, j);

            j = i;

            if (char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR) {
                language = segment;
            } else {
                modifiers.push(segment);
            }
        }
    }

    const type = queryString.substring(0, j);

    return {
        type,
        modifiers: modifiers.reverse(),
        language,
    };
}

let typeHierarchy = {};
const getTypeHierarchy = (typeId: string): string[] => {
    let hierarchy = typeHierarchy[typeId];
    if (!hierarchy) {
        typeHierarchy[typeId] = hierarchy = [typeId];
    }
    return hierarchy;
};

export const getScore = (selector: TokenSelector, querySelector: TokenSelector): number => {
    let score = 0;
    if (selector.language !== undefined) {
        if (selector.language !== querySelector.language) {
            return -1;
        }
        score += 10;
    }
    if (selector.type !== TOKEN_TYPE_WILDCARD) {
        const hierarchy = getTypeHierarchy(querySelector.type);
        const level = hierarchy.indexOf(selector.type);

        if (level === -1) {
            return -1;
        }
        score += 100;
    }
    // all selector modifiers must be present
    for (const selectorModifier of selector.modifiers) {
        if (querySelector.modifiers.indexOf(selectorModifier) === -1) {
            return -1;
        }
    }
    return score + selector.modifiers.length * 100;
};

export const match = (
    semanticTokens: SemanticToken[],
    querySelector: TokenSelector,
): Maybe<TokenWinner<SemanticToken>> => {
    let winner: Maybe<TokenWinner<SemanticToken>> = undefined;

    semanticTokens.forEach(token => {
        const selector = createQuerySelector(token.scope);

        const score = getScore(selector, querySelector);

        if (score > (winner?.score || 0)) {
            winner = {
                token,
                score,
            };
        }
    });

    typeHierarchy = {};

    return winner;
};

export const getSelectorFallback = (
    querySelector: TokenSelector,
): TokenWinner<TokenFallback> | undefined => {
    let winner: { token: TokenFallback; score: number } | undefined = undefined;

    registry.getTokenDefaultStyles().forEach(tokenDefault => {
        const { selector } = tokenDefault;

        const score = getScore(selector, querySelector);

        if (score > (winner?.score || 0)) {
            winner = {
                token: tokenDefault,
                score,
            };
        }
    });

    return winner;
};

export const getSemanticTokenRule = (
    tokens: SemanticToken[],
    selector: string | TokenSelector,
): { semanticToken?: SemanticToken; fallbackScopes?: string[] } | undefined => {
    const querySelector = typeof selector === 'string' ? createQuerySelector(selector) : selector;

    const winner: Maybe<TokenWinner<SemanticToken>> = match(tokens, querySelector);

    if (winner) {
        return {
            semanticToken: winner.token,
        };
    }

    const fallback = getSelectorFallback(querySelector);

    if (fallback) {
        return {
            fallbackScopes: fallback.token.fallbackScopes,
        };
    }
};

export const createTokenString = ({ type, modifiers, language }): string =>
    `${[type, ...[...modifiers].sort()].join('.')}${language !== undefined ? ':' + language : ''}`;
