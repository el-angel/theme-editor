import { Position } from '../types';

interface Options {
    code: string;
}

class CodeDocument {
    _raw: string;
    _lines: string[];

    constructor(opts: Options) {
        this._raw = opts.code;
        this._lines = opts.code.split(/[\n\r]/g);
    }

    public getTextAtPosition(position: Position): string {
        const { line, start, length } = position;

        return this._lines[line].substr(start, length);
    }

    public length(): number {
        return this._raw.length;
    }

    public getLines(): string[] {
        return this._lines;
    }

    public getRaw(): string {
        return this._raw;
    }
}

export default CodeDocument;
