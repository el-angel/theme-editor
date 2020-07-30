// qualified string [type|*](.modifier)*(/language)!
export type TokenClassificationString = string;

export const TOKEN_TYPE_WILDCARD = '*';
export const TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR = ':';
export const CLASSIFIER_MODIFIER_SEPARATOR = '.';

export const idPattern = '\\w+[-_\\w+]*';
export const typeAndModifierIdPattern = `^${idPattern}$`;

export const selectorPattern = `^(${idPattern}|\\*)(\\${CLASSIFIER_MODIFIER_SEPARATOR}${idPattern})*(\\${TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR}${idPattern})?$`;

interface ParsedSelector {
    type: string;
    modifiers: string[];
    language?: string;
}

export function parseSelector(selector: string): ParsedSelector {
    if (!selector.match(selectorPattern)) {
        throw new Error(`${selector} is not a valid selector.`);
    }

    let i = selector.length,
        j = selector.length,
        language;

    const modifiers: string[] = [];

    for (; i >= 0; i--) {
        const char = selector[i];
        if (
            char === CLASSIFIER_MODIFIER_SEPARATOR ||
            char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR
        ) {
            const segment = selector.substring(i + 1, j);

            j = i;

            if (char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR) {
                language = segment;
            } else {
                modifiers.push(segment);
            }
        }
    }

    const type = selector.substring(0, j);

    return {
        type,
        modifiers: modifiers.reverse(),
        language,
    };
}

interface TokenBase {
    id: string;
}

type TokenType = TokenBase;
type TokenModifier = TokenBase;

class SemanticTokenRegistry {
    private _tokenTypes: Record<string, TokenType> = {};
    private _tokenModifiers: Record<string, TokenModifier> = {};

    constructor() {}

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

    public registerTokenStyle(_selector: string, textMateScopes: string[]) {
        try {
            const selector = parseSelector(_selector);
        } catch (e) {
            console.log(e);
        }
    }
}

const registry = new SemanticTokenRegistry();

export default registry;
