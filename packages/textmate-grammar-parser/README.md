# `textmate-grammar-parser`

> TODO: description

## Usage

First copy following files into your applications static folder (which is accessable via window.fetch):
- all the wanted grammar files from ./grammar
- onigasm.wasm (https://github.com/NeekSandhu/onigasm), also in ./node_modules/lib/onigasm.wasm

Before you can use the helper, you should bootstrap your app with the init module
```
import { initialize } from '@anche/textmate-grammar-helper';

const ONIGASM_URL = '/public/static/onigasm.wasm';

(async () => {
  await initialize(ONIGASM_URL);
  App.start();
})();

```

GrammarHelper setup

```
import GrammarHelper from '@anche/textmate-grammar-parser';

const GrammarHelper = new GrammarHelper({
  filePaths: {
    // [scopeName]: path to your static folder
    'source.tsx': '/grammar/typescriptreact.json',
  }
});
```
