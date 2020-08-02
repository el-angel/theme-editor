/*---------------------------------------------------------------------------------------------
 * These test cases are copied from https://github.com/aeschli/typescript-vscode-sh-plugin
 * Copied and slighty modified under MIT license, which can be found in the project root
 *--------------------------------------------------------------------------------------------*/

import parser from '~/suppliers/TypeScript';
import { Language } from '~/types';

const json = obj => JSON.stringify(obj);

const t = (line, start, length, _token) => {
    const token = _token.split('.');
    return {
        line,
        start,
        length,
        type: token.shift(),
        modifiers: token.join('.'),
    };
};

const compare = (code: string, language: Language, expected: ReturnType<typeof t>[]): void => {
    const tokens = parser({ code, language });

    expect(json(tokens)).toBe(json(expected));
};

describe('Semantic Highlighting', () => {
    test('Variables', () => {
        const code = [
            /*0*/ '  var x = 9, y1 = [x];',
            /*1*/ '  try {',
            /*2*/ '    for (const s of y1) { x = s }',
            /*3*/ '  } catch (e) {',
            /*4*/ '    throw y1;',
            /*5*/ '  }',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'variable.declaration'),
            t(0, 13, 2, 'variable.declaration'),
            t(0, 19, 1, 'variable'),
            t(2, 15, 1, 'variable.declaration.readonly.local'),
            t(2, 20, 2, 'variable'),
            t(2, 26, 1, 'variable'),
            t(2, 30, 1, 'variable.readonly.local'),
            t(3, 11, 1, 'variable.declaration.local'),
            t(4, 10, 2, 'variable'),
        ]);
    });

    test('Functions', () => {
        const code = [
            /*0*/ 'function foo(p1) {',
            /*1*/ '  return foo(Math.abs(p1))',
            /*2*/ '}',
            /*3*/ '`/${window.location}`.split("/").forEach(s => foo(s));',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 9, 3, 'function.declaration'),
            t(0, 13, 2, 'parameter.declaration'),
            t(1, 9, 3, 'function'),
            t(1, 13, 4, 'variable.defaultLibrary'),
            t(1, 18, 3, 'member.defaultLibrary'),
            t(1, 22, 2, 'parameter'),
            t(3, 4, 6, 'variable.defaultLibrary'),
            t(3, 11, 8, 'property.defaultLibrary'),
            t(3, 22, 5, 'member.defaultLibrary'),
            t(3, 33, 7, 'member.defaultLibrary'),
            t(3, 41, 1, 'parameter.declaration'),
            t(3, 46, 3, 'function'),
            t(3, 50, 1, 'parameter'),
        ]);
    });

    test('Members', () => {
        const code = [
            /*0*/ 'class A {',
            /*1*/ '  static x = 9;',
            /*2*/ '  f = 9;',
            /*3*/ '  async m() { return A.x + await this.m(); };',
            /*4*/ '  get s() { return this.f; ',
            /*5*/ '  static t() { return new A().f; };',
            /*6*/ '  constructor() {}',
            /*8*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'class.declaration'),
            t(1, 9, 1, 'property.declaration.static'),
            t(2, 2, 1, 'property.declaration'),
            t(3, 8, 1, 'member.declaration.async'),
            t(3, 21, 1, 'class'),
            t(3, 23, 1, 'property.static'),
            t(3, 38, 1, 'member.async'),
            t(4, 6, 1, 'property.declaration'),
            t(4, 24, 1, 'property'),
            t(5, 9, 1, 'member.declaration.static'),
            t(5, 26, 1, 'class'),
            t(5, 30, 1, 'property'), //#
        ]);
    });

    test('Class Properties', () => {
        const code = [
            /*0*/ 'class A { ',
            /*1*/ '  private y: number;',
            /*2*/ '  constructor(public x : number, _y : number) { this.y = _y; }',
            /*3*/ '  get z() : number { return this.x + this.y; }',
            /*4*/ '  set a(v: number) { }',
            /*5*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'class.declaration'),
            t(1, 10, 1, 'property.declaration'),
            t(2, 21, 1, 'parameter.declaration'),
            t(2, 33, 2, 'parameter.declaration'),
            t(2, 53, 1, 'property'),
            t(2, 57, 2, 'parameter'),
            t(3, 6, 1, 'property.declaration'),
            t(3, 33, 1, 'property'),
            t(3, 42, 1, 'property'),
            t(4, 6, 1, 'property.declaration'),
            t(4, 8, 1, 'parameter.declaration'),
        ]);
    });

    test('Object Properties', () => {
        const code = [
            /*0*/ 'let x = 1, y = 1;',
            /*1*/ 'const a1 = { e: 1 };',
            /*2*/ 'var a2 = { x };',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 4, 1, 'variable.declaration'),
            t(0, 11, 1, 'variable.declaration'),
            t(1, 6, 2, 'variable.declaration.readonly'),
            t(1, 13, 1, 'property.declaration'),
            t(2, 4, 2, 'variable.declaration'),
            t(2, 11, 1, 'property.declaration'),
        ]);
    });

    test('Callable Variables & Properties', () => {
        const code = [
            /*0*/ 'class A { onEvent: () => void; }',
            /*1*/ 'const x = new A().onEvent;',
            /*2*/ 'const match = (s: any) => x();',
            /*3*/ 'const other = match;',
            /*4*/ 'match({ other });',
            /*5*/ 'interface B = { (): string; }; var b: B',
            /*6*/ 'var s: String;',
            /*7*/ 'var t: { (): string; foo: string};',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'class.declaration'),
            t(0, 10, 7, 'member.declaration'),
            t(1, 6, 1, 'function.declaration.readonly'),
            t(1, 14, 1, 'class'),
            t(1, 18, 7, 'member'),
            t(2, 6, 5, 'function.declaration.readonly'),
            t(2, 15, 1, 'parameter.declaration'),
            t(2, 26, 1, 'function.readonly'),
            t(3, 6, 5, 'function.declaration.readonly'),
            t(3, 14, 5, 'function.readonly'),
            t(4, 0, 5, 'function.readonly'),
            t(4, 8, 5, 'member.declaration'),
            t(5, 10, 1, 'interface.declaration'),
            t(5, 35, 1, 'variable.declaration'),
            t(5, 38, 1, 'interface'),
            t(6, 4, 1, 'variable.declaration'),
            t(6, 7, 6, 'interface.defaultLibrary'),
            t(7, 4, 1, 'variable.declaration'),
            t(7, 21, 3, 'property.declaration'),
        ]);
    });

    test('Callable Variables & Properties 2', () => {
        const code = [
            /*0*/ 'import "node";',
            /*1*/ 'var fs = require("fs")',
            /*2*/ `require.resolve('react');`,
            /*3*/ `require.resolve.paths;`,
            /*4*/ `interface LanguageMode { getFoldingRanges?: (d: string) => number[]; };`,
            /*5*/ `function (mode: LanguageMode | undefined) { if (mode && mode.getFoldingRanges) { return mode.getFoldingRanges('a'); }};`,
            /*6*/ `function b(a: () => void) { a(); };`,
        ].join('\n');

        compare(code, 'ts', [
            t(1, 4, 2, 'variable.declaration'),
            t(1, 9, 7, 'function'),
            t(2, 0, 7, 'variable'),
            t(2, 8, 7, 'member'),
            t(3, 0, 7, 'variable'),
            t(3, 8, 7, 'property'),
            t(3, 16, 5, 'member'),
            t(4, 10, 12, 'interface.declaration'),
            t(4, 25, 16, 'member.declaration'),
            t(4, 45, 1, 'parameter.declaration'),
            t(5, 10, 4, 'parameter.declaration'),
            t(5, 16, 12, 'interface'),
            t(5, 48, 4, 'parameter'),
            t(5, 56, 4, 'parameter'),
            t(5, 61, 16, 'member'),
            t(5, 88, 4, 'parameter'),
            t(5, 93, 16, 'member'),
            t(6, 9, 1, 'function.declaration'),
            t(6, 11, 1, 'function.declaration'),
            t(6, 28, 1, 'function'),
        ]);
    });

    test('Constructor Types', () => {
        const code = [
            /*0*/ 'Object.create(null);',
            /*1*/ `const x = Promise.resolve(Number.MAX_VALUE);`,
            /*2*/ `if (x instanceof Promise) {}`,
        ].join('\n');

        compare(code, 'ts', [
            t(0, 0, 6, 'class.defaultLibrary'),
            t(0, 7, 6, 'member.defaultLibrary'),
            t(1, 6, 1, 'variable.declaration.readonly'),
            t(1, 10, 7, 'class.defaultLibrary'),
            t(1, 18, 7, 'member.defaultLibrary'),
            t(1, 26, 6, 'class.defaultLibrary'),
            t(1, 33, 9, 'property.readonly.defaultLibrary'),
            t(2, 4, 1, 'variable.readonly'),
            t(2, 17, 7, 'class.defaultLibrary'),
        ]);
    });

    test('Interfaces', () => {
        const code = [
            /*0*/ 'interface Pos { x: number, y: number };',
            /*1*/ 'const p = { x: 1, y: 2 } as Pos;',
            /*2*/ 'const foo = (o: Pos) => o.x + o.y;',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 10, 3, 'interface.declaration'),
            t(0, 16, 1, 'property.declaration'),
            t(0, 27, 1, 'property.declaration'),
            t(1, 6, 1, 'variable.declaration.readonly'),
            t(1, 12, 1, 'property.declaration'),
            t(1, 18, 1, 'property.declaration'),
            t(1, 28, 3, 'interface'),
            t(2, 6, 3, 'function.declaration.readonly'),
            t(2, 13, 1, 'parameter.declaration'),
            t(2, 16, 3, 'interface'),
            t(2, 24, 1, 'parameter'),
            t(2, 26, 1, 'property'),
            t(2, 30, 1, 'parameter'),
            t(2, 32, 1, 'property'),
        ]);
    });

    test('Enums', () => {
        const code = [
            /*0*/ 'export enum TextDocumentSaveReason {',
            /*1*/ '  Manual = 1',
            /*2*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 12, 22, 'enum.declaration'),
            t(1, 2, 6, 'enumMember.declaration.readonly'),
        ]);
    });

    test('Readonly', () => {
        const code = [
            /*0*/ 'const f = 9;',
            /*1*/ 'class A { static readonly t = 9; static url: URL; }',
            /*2*/ 'const enum E { A = 9, B = A + 1 }',
            /*3*/ 'console.log(f + A.t + A.url.origin + E.A);',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'variable.declaration.readonly'),
            t(1, 6, 1, 'class.declaration'),
            t(1, 26, 1, 'property.declaration.static.readonly'),
            t(1, 40, 3, 'property.declaration.static'),
            t(1, 45, 3, 'interface.defaultLibrary'),
            t(2, 11, 1, 'enum.declaration'),
            t(2, 15, 1, 'enumMember.declaration.readonly'),
            t(2, 22, 1, 'enumMember.declaration.readonly'),
            t(2, 26, 1, 'enumMember.readonly'),
            t(3, 0, 7, 'variable.defaultLibrary'),
            t(3, 8, 3, 'member.defaultLibrary'),
            t(3, 12, 1, 'variable.readonly'),
            t(3, 16, 1, 'class'),
            t(3, 18, 1, 'property.static.readonly'),
            t(3, 22, 1, 'class'),
            t(3, 24, 3, 'property.static'),
            t(3, 28, 6, 'property.readonly.defaultLibrary'),
            t(3, 37, 1, 'enum'),
            t(3, 39, 1, 'enumMember.readonly'),
        ]);
    });

    test('Local', () => {
        const code = [
            /*0*/ 'const f = 9;',
            /*1*/ 'if (f > 0) { let x = 9;',
            /*2*/ '  function foo(p: number) { var y = x; }',
            /*3*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 6, 1, 'variable.declaration.readonly'),
            t(1, 4, 1, 'variable.readonly'),
            t(1, 17, 1, 'variable.declaration.local'),
            t(2, 11, 3, 'function.declaration.local'),
            t(2, 15, 1, 'parameter.declaration'),
            t(2, 32, 1, 'variable.declaration.local'),
            t(2, 36, 1, 'variable.local'),
        ]);
    });

    test('Type Aliases and Type Parameters', () => {
        const code = [
            /*0*/ 'type MyMap = Map<string, number>;',
            /*1*/ 'function f<T extends MyMap>(t: T | number) : T { ',
            /*2*/ '  return <T> <unknown> new Map<string, MyMap>();',
            /*3*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 5, 5, 'type.declaration'),
            t(0, 13, 3, 'interface.defaultLibrary'),
            t(1, 9, 1, 'function.declaration'),
            t(1, 11, 1, 'typeParameter.declaration'),
            t(1, 21, 5, 'type'),
            t(1, 28, 1, 'parameter.declaration'),
            t(1, 31, 1, 'typeParameter'),
            t(1, 45, 1, 'typeParameter'),
            t(2, 10, 1, 'typeParameter'),
            t(2, 27, 3, 'class.defaultLibrary'),
            t(2, 39, 5, 'type'),
        ]);
    });

    test('New Expressions', () => {
        const code = [
            /*0*/ 'new Map<string, string>();',
            /*1*/ 'class A {} new A();',
            /*2*/ 'class B { constructor(i: number){} } new B(1);',
            /*3*/ 'new Date()',
            /*4*/ 'new window.Date()',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 4, 3, 'class.defaultLibrary'),
            t(1, 6, 1, 'class.declaration'),
            t(1, 15, 1, 'class'),
            t(2, 6, 1, 'class.declaration'),
            t(2, 22, 1, 'parameter.declaration'),
            t(2, 41, 1, 'class'),
            t(3, 4, 4, 'class.defaultLibrary'),
            t(4, 4, 6, 'variable.defaultLibrary'),
            t(4, 11, 4, 'class.defaultLibrary'),
        ]);
    });

    test('Bindingelement as a parameter', () => {
        const code = [
            /*0*/ 'interface Person { name: string; age: number; }',
            /*1*/ 'function greet({ name, age }: Person) {',
            /*2*/ '  return `hello ` + name;',
            /*2*/ '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 10, 6, 'interface.declaration'),
            t(0, 19, 4, 'property.declaration'),
            t(0, 33, 3, 'property.declaration'),
            t(1, 9, 5, 'function.declaration'),
            t(1, 17, 4, 'parameter.declaration'),
            t(1, 23, 3, 'parameter.declaration'),
            t(1, 30, 6, 'interface'),
            t(2, 20, 4, 'parameter'),
        ]);
    });

    test('Bindingelement as a variable', () => {
        const code = [
            'interface Person { name: string; age: number; }',
            'function loop(persons: Person[]) {',
            '    let totalAge = 0;',
            '    for (const { name: localName, age: localAge } of persons) {',
            '        totalAge += localAge;',
            '    }',
            '}',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 10, 6, 'interface.declaration'),
            t(0, 19, 4, 'property.declaration'),
            t(0, 33, 3, 'property.declaration'),
            t(1, 9, 4, 'function.declaration'),
            t(1, 14, 7, 'parameter.declaration'),
            t(1, 23, 6, 'interface'),
            t(2, 8, 8, 'variable.declaration.local'),
            t(3, 17, 4, 'property'),
            t(3, 23, 9, 'variable.declaration.readonly.local'),
            t(3, 34, 3, 'property'),
            t(3, 39, 8, 'variable.declaration.readonly.local'),
            t(3, 53, 7, 'parameter'),
            t(4, 8, 8, 'variable.local'),
            t(4, 20, 8, 'variable.readonly.local'),
        ]);
    });

    test('FunctionExpression', () => {
        const code = ['function getSum() {', '    return function sum() {', '    };', '}'].join(
            '\n',
        );

        compare(code, 'ts', [
            t(0, 9, 6, 'function.declaration'),
            t(1, 20, 3, 'function.declaration'),
        ]);
    });

    test('Library', () => {
        const code = [
            /*0*/ 'new WeakMap<Function, Array<RegExp>>();',
            /*1*/ `console.log(eval('x + y'));`,
            /*2*/ `Promise.resolve<ReadableStream | WebSocket | null>(null);`,
            /*3*/ `setTimeout(s => { encodeURIComponent('abc'.replace('a', 'b'));})`,
            /*4*/ 'interface Position { x: number, y: number }; const f = (p: Position) => p.x + p.timestamp;',
        ].join('\n');

        compare(code, 'ts', [
            t(0, 4, 7, 'class.defaultLibrary'),
            t(0, 12, 8, 'interface.defaultLibrary'),
            t(0, 22, 5, 'interface.defaultLibrary'),
            t(0, 28, 6, 'interface.defaultLibrary'),
            t(1, 0, 7, 'variable.defaultLibrary'),
            t(1, 8, 3, 'member.defaultLibrary'),
            t(1, 12, 4, 'function.defaultLibrary'),
            t(2, 0, 7, 'class.defaultLibrary'),
            t(2, 8, 7, 'member.defaultLibrary'),
            t(2, 16, 14, 'interface.defaultLibrary'),
            t(2, 33, 9, 'interface.defaultLibrary'),
            t(3, 0, 10, 'function.defaultLibrary'),
            t(3, 11, 1, 'parameter.declaration'),
            t(3, 18, 18, 'function.defaultLibrary'),
            t(3, 43, 7, 'member.defaultLibrary'),
            t(4, 10, 8, 'interface.declaration.defaultLibrary'),
            t(4, 21, 1, 'property.declaration'),
            t(4, 32, 1, 'property.declaration'),
            t(4, 51, 1, 'function.declaration.readonly'),
            t(4, 56, 1, 'parameter.declaration'),
            t(4, 59, 8, 'interface.defaultLibrary'),
            t(4, 72, 1, 'parameter'),
            t(4, 74, 1, 'property'),
            t(4, 78, 1, 'parameter'),
            t(4, 80, 9, 'property.readonly.defaultLibrary'),
        ]);
    });

    test('Library without value declaration', () => {
        const code = [/*0*/ 'type MyIterator = IterableIterator<{ name: string }>;'].join('\n');

        compare(code, 'ts', [
            t(0, 5, 10, 'type.declaration'),
            t(0, 18, 16, 'interface.defaultLibrary'),
            t(0, 37, 4, 'property.declaration'),
        ]);
    });

    test('JSX', () => {
        const code = [
            /*0*/ 'import * as React from "react";',
            /*1*/ 'function () {',
            /*2*/ '  return (<div className="App">{React.version}</div>);',
            /*3*/ '}',
        ].join('\n');

        compare(code, 'tsx', [t(2, 32, 5, 'namespace'), t(2, 38, 7, 'variable.readonly')]);
    });

    test('JSX2', () => {
        const code = [
            /*0*/ 'const MyComponent = (props) => <div></div>',
            /*1*/ 'const ItemPrice = (props) => {',
            /*2*/ '  return <MyComponent { ...props } />;',
            /*3*/ '}',
        ].join('\n');

        compare(code, 'tsx', [
            t(0, 6, 11, 'function.declaration.readonly'),
            t(0, 21, 5, 'parameter.declaration'),
            t(1, 6, 9, 'function.declaration.readonly'),
            t(1, 19, 5, 'parameter.declaration'),
        ]);
    });
});

export {};
