# `semantic-tokens-utilities`

This package exposes several utilities that help with Semantic Tokens.

```typescript
interface Position {
    line: number;
    start: number;
    length: number;
}

interface Token {
    type: string;
    modifiers: string[];
    language?: string;
}

interface SemanticToken extends Position, Token {}
```

## Usage

First you should/could initialize the match helper with the scope fallbacks before you use the match utility from this package. Those fallbacks are TextMate scopes. (https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide).

(You could call the initialize module before starting your app)

```typescript
import { initialize } from '@anche/semantic-tokens-utilities';

export type FallbackRegister = (tokenString: string, fallbackScopes: string[]) => void;

(() => {
    initialize((registerTokenFallback: FallbackRegister) => {
        // Define your fallbacks:

        registerTokenFallback('namespace', 'entity.name.namespace');
    });
    App.start();
})();
```

```typescript
// If you want to have the same fallbacks as VSCode
import { initialize, Presets } from '@anche/semantic-tokens-utilities';

initialize(Presets.vscode);
```

## Parser

The parser transforms a string into a CodeDocument and returns an array of Semantic Tokens

(This can only be executed on a node server)

```typescript
interface CodeDocument {
    getTextAtPosition(position: Position): string;
    getLines(): string[];
    getRaw(): string;
}

type SemanticTokensParserResult = <T extends Position>{
    code: CodeDocument;
    tokens: T[];
}

import { parser } from '@anche/semantic-tokens-utilities';

const rawCode = `const semanticTokens = () => {}`;

const parserResult = parser({ code: rawCode, language: 'tsx' })
;

const firstNode = parserResult.tokens[0];
// `semanticTokens` is a Semantic Token:
// {
//     line: 0,
//     start: 6,
//     length: 13,
//     type: 'function',
//     modifiers: ['declaration', 'readonly'],
//     language: undefined
// }
```

### Matcher

```typescript
interface Token {
    type: string;
    modifiers: string[];
    language?: string;
}

interface TokenFallback {
    token: Token;
    fallbackScopes: string[];
}

interface TokenWinner<T extends Token> {
    token: T;
    score: number;
}

interface Matcher {
    // returns a Semantic Token or TextMate fallback scopes
    matchToken: <T extends Token>(
        token: string | Token,
        semanticTokens: T[],
    ) =>
        | {
              token?: T;
              fallbackScopes: string[];
          }
        | undefined;

    //  will return TextMate fallback scopes defined during initialization
    getFallback: (token: Token) => TokenFallback | undefined;

    // will return a matching Semantic Token or undefined
    getMatch: <T extends Token>(token: Token, semanticTokens: T[]) => TokenWinner<T> | undefined;
}

// Defined Semantic Tokens
const semanticTokens = [
    { scope: 'member.defaultLibrary', color: '#000000' }
    { scope: 'variable.declaration.readonly', color: '#ff00ff'
    { scope: 'function', color: '#00ff00' }
];

const code = `const semanticTokens = () => {};`;

// after parsing you have the node for `semanticTokens`:
const firstNode = parserResult.tokens[0];
// {
//     line: 0,
//     start: 6,
//     length: 13,
//     type: 'function',
//     modifiers: ['declaration', 'readonly'],
//     language: undefined
// }

import { Matcher } from '@anche/semantic-tokens-utilities';

// semanticTokens[2] will return
const rule = Matcher.matchToken(firstNode, semanticTokens);


```
