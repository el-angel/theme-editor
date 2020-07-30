export interface ThemeRule {
    name: string;
    scope: string[] | string;
    settings: {
        fontStyle?: string;
        foreground: string;
    };
}

export interface Theme {
    name: string;
    colors: {
        [scope: string]: string;
    };
    semanticTokens: boolean;
    tokenColors: ThemeRule[];
    type: 'dark' | 'light';
}
