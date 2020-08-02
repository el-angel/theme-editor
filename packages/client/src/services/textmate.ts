import { TextMateScopesParser } from '@anche/textmate-utilities';

export const Languages = {
    'source.ts': 'TypeScript',
    'source.tsx': 'TypeScript React',
    'source.js': 'JavaScript',
    'source.jsx': 'JavaScript React',
    'source.css': 'CSS',
    'text.html.basic': 'HTML',
    'source.json': 'JSON',
};

const getUrl = (file: string): string => `${process.env.PUBLIC_URL}/grammar/${file}`;

const textmateService = new TextMateScopesParser({
    filePaths: {
        'source.ts': getUrl('typescript.json'),
        'source.tsx': getUrl('typescriptreact.json'),
        'source.js': getUrl('javascript.json'),
        'source.jsx': getUrl('javascriptreact.json'),
        'source.css': getUrl('css.json'),
        'text.html.basic': getUrl('html.json'),
        'source.json': getUrl('json.json'),
    },
});

export default textmateService;
