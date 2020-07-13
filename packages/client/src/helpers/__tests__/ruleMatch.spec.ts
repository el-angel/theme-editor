import { _match } from '~/helpers/ruleMatch';

const scopes = [
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

type Case = {
  rules: string[];
  expect: string;
};

const cases: Case[] = [
  {
    expect: 'source.tsx meta.jsx meta.tag',
    rules: ['source meta.tag meta.tag', 'source.tsx meta.jsx meta.tag'],
  },
  {
    expect: 'meta.block meta.tag.without-attributes punctuation.section',
    rules: [
      'meta.arrow meta.tag.without-attributes punctuation',
      'meta.block meta.tag.without-attributes punctuation.section',
    ],
  },
  {
    expect: 'meta.jsx.children',
    rules: ['meta.arrow meta.tag-without-attributes', 'meta.var.expr.tsx', 'meta.jsx.children'],
  },
  {
    expect: 'punctuation.section.embedded.begin.tsx',
    rules: [
      'source.tsx meta.var.expr',
      'source.tsx meta.block',
      'source.tsx meta.embedded',
      'meta.embedded.expression.tsx',
      'punctuation.section.embedded.begin.tsx',
    ],
  },
  {
    expect: 'meta.embedded.expression',
    rules: [
      'source.tsx meta.var.expr',
      'source.tsx meta.block',
      'source.tsx meta.embedded',
      'meta.embedded.expression',
    ],
  },

  {
    expect: 'meta.embedded.expression',
    rules: [
      'source.tsx meta.var.expr',
      'source.tsx meta.block',
      'source.tsx meta.embedded',
      'meta.embedded.expression',
    ],
  },
  {
    expect: 'source.tsx meta.embedded',
    rules: ['source.tsx meta.var.expr', 'source.tsx meta.block', 'source.tsx meta.embedded'],
  },
  {
    expect: 'source.tsx meta.block',
    rules: ['source.tsx meta.var.expr', 'source.tsx meta.block'],
  },
];

describe('RuleMatch', () => {
  cases.map(c => {
    it(`_ ${c.expect}`, () => {
      const winner = _match(c.rules, scopes);
      expect(winner?.query).toBe(c.expect);
    });
  });
});

export {};
