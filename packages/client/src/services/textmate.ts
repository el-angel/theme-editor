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
        'source.ts': getUrl('TypeScript.tmLanguage.json'),
        'source.tsx': getUrl('TypeScriptReact.tmLanguage.json'),
        'source.js': getUrl('JavaScript.tmLanguage.json'),
        'source.jsx': getUrl('JavaScriptReact.tmLanguage.json'),
        'source.css': getUrl('css.tmLanguage.json'),
        'text.html.basic': getUrl('html.tmLanguage.json'),
        'source.json': getUrl('JSON.tmLanguage.json'),
    },
});

export default textmateService;
