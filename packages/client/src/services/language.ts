import { GrammarHelper } from '@anche/textmate-grammar-parser';

export const Languages = {
  'source.ts': 'TypeScript',
  'source.tsx': 'TypeScript React',
  'source.js': 'JavaScript',
  'source.jsx': 'JavaScript React',
  'source.css': 'CSS',
  'text.html.basic': 'HTML',
  'source.json': 'JSON',
};

const languageService = new GrammarHelper({
  filePaths: {
    'source.ts': '/grammar/typescript.json',
    'source.tsx': '/grammar/typescriptreact.json',
    'source.js': '/grammar/javascript.json',
    'source.jsx': '/grammar/javascriptreact.json',
    'source.css': '/grammar/css.json',
    'text.html.basic': '/grammar/html.json',
    'source.json': '/grammar/json.json',
  },
});

export default languageService;
