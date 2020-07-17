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

export interface Rule extends StateMeta {
    id: string;
    name: string;
    scope: string[];
    settings: Settings;
}

export interface GeneralScope extends StateMeta {
    scope: string;
    color: string;
}

export interface CSS {
    [classname: string]: React.CSSProperties;
}
