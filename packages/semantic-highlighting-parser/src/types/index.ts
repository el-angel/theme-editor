export interface Position {
    line: number;
    start: number;
    length: number;
}

export interface SemanticToken extends Position {
    type: string;
    modifiers: string;
}

export type Language = 'jsx' | 'js' | 'ts' | 'tsx';
