import CodeDocument from '../helpers/CodeDocument';

export interface Position {
    line: number;
    start: number;
    length: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parser<T extends Position> = (...args: any[]) => { code: CodeDocument; tokens: T[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserAsync<T extends Position> = (...args: any[]) => Promise<ReturnType<Parser<T>>>;

export interface Supplier<T extends Position> {
    parse: Parser<T> | ParserAsync<T>;
}
