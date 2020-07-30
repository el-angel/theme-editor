import { parseSelector } from '../semanicToken';

type ParsedSelector = ReturnType<typeof parseSelector>;

const assertParseSelector = (selector: string, expected: ParsedSelector) => {
    const actual = parseSelector(selector);

    expect(actual).toEqual(expected);
};

describe('SemanticToken', () => {
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
