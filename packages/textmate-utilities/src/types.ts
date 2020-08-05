import { Position } from '@anche/shared';

type Scope = string;

export interface TextMateRule {
    scopes: Scope[];
}

export interface TextMateNode extends Position, TextMateRule {}
