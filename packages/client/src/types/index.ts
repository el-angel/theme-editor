import SemanticToken from '~/containers/Sidebar/components/SemanticToken';

import { EntityType, FontStyle } from '~/constants';

export interface Settings {
    foreground: string;
    background?: string;
    fontStyle?: FontStyle[];
}

export interface StateMeta<T extends EntityType> {
    __type: T;
}

export interface Base<T extends EntityType = EntityType> extends StateMeta<T> {
    id: string;
    scope: string[] | string;
    settings: Settings;
}

export interface Rule extends Base<EntityType.Rule> {
    name: string;
    scope: string[];
}

export interface SemanticToken extends Base<EntityType.SemanticToken> {
    scope: string;
}

export interface GeneralScope extends Base<EntityType.GeneralScope> {
    scope: string;
}

export type Entity = GeneralScope | Rule | SemanticToken;

export interface CSS {
    [classname: string]: React.CSSProperties;
}
