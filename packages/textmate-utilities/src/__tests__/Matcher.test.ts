import match from '../Matcher';

const nodeScopes = [
    'source.tsx',
    'meta.var.expr.tsx',
    'meta.arrow.tsx',
    'meta.block.tsx',
    'meta.tag.tsx',
    'meta.jsx.children.tsx',
    'meta.tag.without-attributes.tsx',
    'meta.embedded.expression.tsx',
    'meta.tag.attributes.tsx',
    'punctuation.section.embedded.begin.tsx',
];

const cases = [
    {
        expect: 'source.tsx meta.jsx meta.tag',
        rules: [
            { scopes: ['source meta.tag meta.tag'] },
            { scopes: ['source.tsx meta.jsx meta.tag'] },
        ],
    },
    {
        expect: 'meta.block meta.tag.without-attributes punctuation.section',
        rules: [
            { scopes: ['meta.arrow meta.tag.without-attributes punctuation'] },
            { scopes: ['meta.block meta.tag.without-attributes punctuation.section'] },
        ],
    },
    {
        expect: 'meta.jsx.children',
        rules: [
            { scopes: ['meta.arrow meta.tag-without-attributes'] },
            { scopes: ['meta.var.expr.tsx'] },
            { scopes: ['meta.jsx.children'] },
        ],
    },
    {
        expect: 'punctuation.section.embedded.begin.tsx',
        rules: [
            { scopes: ['source.tsx meta.var.expr'] },
            { scopes: ['source.tsx meta.block'] },
            { scopes: ['source.tsx meta.embedded'] },
            { scopes: ['meta.embedded.expression.tsx'] },
            { scopes: ['punctuation.section.embedded.begin.tsx'] },
        ],
    },
    {
        expect: 'meta.embedded.expression',
        rules: [
            { scopes: ['source.tsx meta.var.expr'] },
            { scopes: ['source.tsx meta.block'] },
            { scopes: ['source.tsx meta.embedded'] },
            { scopes: ['meta.embedded.expression'] },
        ],
    },

    {
        expect: 'meta.embedded.expression',
        rules: [
            { scopes: ['source.tsx meta.var.expr'] },
            { scopes: ['source.tsx meta.block'] },
            { scopes: ['source.tsx meta.embedded'] },
            { scopes: ['meta.embedded.expression'] },
        ],
    },
    {
        expect: 'source.tsx meta.embedded',
        rules: [
            { scopes: ['source.tsx meta.var.expr'] },
            { scopes: ['source.tsx meta.block'] },
            { scopes: ['source.tsx meta.embedded'] },
        ],
    },
    {
        expect: 'source.tsx meta.block',
        rules: [{ scopes: ['source.tsx meta.var.expr'] }, { scopes: ['source.tsx meta.block'] }],
    },
];

describe('Matcher', () => {
    cases.map(c => {
        it(`Winner: ${c.expect}`, () => {
            const winner = match(nodeScopes, c.rules);
            expect(winner?.scopes[0]).toBe(c.expect);
        });
    });
});

export {};
