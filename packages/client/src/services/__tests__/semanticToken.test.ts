import { uniqueId } from 'lodash';

import { EntityType } from '~/constants';

import { SemanticToken } from '~/types';

import { createQuerySelector, getSemanticTokenRule } from '../semanticToken';

type ParsedSelector = ReturnType<typeof createQuerySelector>;

const assertParseSelector = (selector: string, expected: ParsedSelector) => {
    const actual = createQuerySelector(selector);

    expect(actual).toEqual(expected);
};

const generateSemanticToken = (scope: string): SemanticToken => ({
    id: uniqueId(),
    scope,
    settings: {
        foreground: '#000000',
    },
    __meta: {
        type: EntityType.SemanticToken,
    },
});

const semanticTokens: SemanticToken[] = [
    generateSemanticToken('type.declaration'),
    generateSemanticToken('*.declaration'),
    generateSemanticToken('function.declaration'),
    generateSemanticToken('namespace.async'),
    generateSemanticToken('parameter.readonly'),
];

describe('SemanticToken', () => {
    describe('matcher', () => {
        test('test', () => {
            const res = getSemanticTokenRule(semanticTokens, 'namespace.async');
            console.log(res);
        });

        test('getTokenFallback', () => {
            const res = getSemanticTokenRule(semanticTokens, 'property.readonly');
            console.log(res);
        });
    });

    describe('parseSelector', () => {
        test('variable.defaultLibrary', () => {
            assertParseSelector('variable.defaultLibrary', {
                type: 'variable',
                modifiers: ['defaultLibrary'],
            });
        });

        test('variable.readonly.defaultLibrary', () => {
            assertParseSelector('variable.readonly.defaultLibrary', {
                type: 'variable',
                modifiers: ['readonly', 'defaultLibrary'],
            });
        });

        test('*.readonly.defaultLibrary', () => {
            assertParseSelector('*.readonly.defaultLibrary', {
                type: '*',
                modifiers: ['readonly', 'defaultLibrary'],
            });
        });

        test('*:java', () => {
            assertParseSelector('*:java', {
                type: '*',
                modifiers: [],
                language: 'java',
            });
        });

        test('*:java', () => {
            assertParseSelector('*:java', {
                type: '*',
                modifiers: [],
                language: 'java',
            });
        });
    });
});

export {};
