type Color = string;
export interface TextMateRule {
    name: string;
    scope: string[] | string;
    settings: {
        fontStyle?: string;
        foreground: Color;
    };
}

export interface SemanticTokenRules {
    [key: string]: {
        foreground?: Color;
        fontStyle?: string;
    };
}

export interface Theme {
    name: string;
    colors: {
        [scope: string]: string;
    };
    semanticHighlighting: boolean;
    tokenColors: TextMateRule[];
    semanticTokenColors: SemanticTokenRules;
    type: 'dark' | 'light';
}
