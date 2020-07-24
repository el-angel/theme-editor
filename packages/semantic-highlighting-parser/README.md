# `textmate-grammar-parser`

This package is just a small wrapper around onigasm and monaco-textmate to be used together to read textmate grammar files and parse raw code strings into Code type objects.

```typescript
type Scope = string;

interface SubLine {
  text: string;
  scopes: Scope[];
}
interface Line {
  number: number;
  content: SubLine[];
}
interface Code {
  lines: Line[];
}
```

## Usage

First copy the following files into your applications static folder (which should be accessable via `window.fetch`):

- all the wanted grammar files from `./grammar`
- `onigasm.wasm` (https://github.com/NeekSandhu/onigasm), also in `./node_modules/lib/onigasm.wasm`

Before you can use the helper, you should bootstrap your app with the init module

```typescript
import { initialize } from '@anche/textmate-grammar-helper';

const ONIGASM_URL = '/public/static/onigasm.wasm';

(async () => {
  await initialize(ONIGASM_URL);
  App.start();
})();
```

GrammarHelper setup

```typescript
import GrammarHelper from '@anche/textmate-grammar-parser';

const grammar = new GrammarHelper({
  filePaths: {
    // [languageScope]: path to your static folder
    'source.tsx': '/grammar/typescriptreact.json',
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

const code = grammar.parse(rawCode, 'source.tsx' /* key of filePaths: languageScope */);
```
