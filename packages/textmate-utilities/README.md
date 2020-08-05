# `textmate-utilities`

This package exposes several utilities that help with TextMate Scopes.

```typescript
// types
interface Position {
    line: number;
    start: number;
    length: number;
}

interface CodeDocument {
    getTextAtPosition(position: Position): string;
    getLines(): string[];
    getRaw(): string;
}

interface TextMateNode extends Position {
    scopes: Scope[];
}

interface TextMateParserResult {
    code: CodeDocument;
    tokens: TextMateNode[];
}
```

## Usage

First copy the following files into your applications static folder (which should be accessable via `window.fetch`):

-   all the wanted grammar files from `./node_modules/@anche/textmate-utilities/grammar` (or add your own, can be json or plist)
-   `onigasm.wasm` (https://github.com/NeekSandhu/onigasm), also in `./node_modules/lib/onigasm.wasm`

Before you can use the helper, you should bootstrap your app with the initialize module

```typescript
import { initialize } from '@anche/textmate-utilities';

const ONIGASM_URL = '/public/static/onigasm.wasm';

(async () => {
    await initialize(ONIGASM_URL);
    App.start();
})();
```

### TextMateScopesParser setup

```typescript
import { TextMateScopesParser } from '@anche/textmate-utilities';

const service = new TextMateScopesParser({
    filePaths: {
        // [languageScope]: 'path to your static grammar file'
        'source.tsx': '/grammar/TypeScriptReact.tmLanguage.json',
    },
});

const rawCode = `
  import React from 'react';

  interface Props {
    onClick: () => void;
  };

  const Button: React.FC<Props> = ({ onClick, children }) => {
    return (
      <button type="button" onClick={onClick}>
        {children}
      </button>
    );
  };

  export default Button;
`;

const code = service.parse(rawCode, 'source.tsx' /* key of filePaths: languageScope */);
```

### Rule/Scope matching

This utility helps by getting the applicable rule for a given scope

```typescript
import { match } from '@anche/textmate-utilities';

interface TextMateRule {
    scopes: string[];
}

type MatchFn = <T extends TextMateRule>(nodeScopes: string | string[], rules: T[]) => T | null;

const rawCode = `import React from 'react';`;

const parsed: { code: CodeDocument; tokens: TextMateNode[] } = service.parse(rawCode, 'source.tsx');

/**
 * the node of `import`, object will look like this:
 * {
 *   line: 0,
 *   start: 0,
 *   length: 6
 *   scopes: [
 *      'keyword.control.import.tsx',
 *      'meta.import.tsx',
 *      'source.tsx',
 *   ],
 * }
 */
const firstNode = parsed.tokens[0];

// Defined TextMate Rules
const textMateRules = [
    { scopes: ['source.tsx', 'keyword.control.import.tsx'], color: '#000000' },
    { scopes: ['meta.var.expr.tsx', 'meta.block.tsx'], color: '#ffffff' },
    { scopes: ['meta.tag entity'], color: '#ff00ff' },
];

// Now you want to know which color the `import` text should be based on your rules, so you need to find out if a rule applies and which one that is:
const rule = match(firstNode.scopes, textMateRules);

// rule = textMateRules[0];
```
