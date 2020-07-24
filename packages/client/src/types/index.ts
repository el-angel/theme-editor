import { FONT_STYLE } from '~/constants';

export interface Settings {
    foreground: string;
    background?: string;
    fontStyle: typeof FONT_STYLE[keyof typeof FONT_STYLE][];
}

export interface StateMeta {
    __meta?: {
        state?: 'deleted';
        touched?: boolean;
    };
}

interface Base extends StateMeta {
    id: string;
    settings: Settings;
}

export interface Rule extends Base {
    name: string;
    scope: string[];
}

export interface SemanticToken extends Base {
    scope: string;
}

export interface GeneralScope extends StateMeta {
    scope: string;
    color: string;
}

export interface CSS {
    [classname: string]: React.CSSProperties;
}
