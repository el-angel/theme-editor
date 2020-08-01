export interface Position {
    line: number;
    start: number;
    length: number;
}

export interface SemanticToken extends Position {
    type: string;
    modifiers: string[];
    language: string | undefined;
}

export type Language = 'jsx' | 'js' | 'ts' | 'tsx';
