import { Position } from '@anche/shared';

export interface TokenFallback {
    token: Token;
    fallbackScopes: string[];
}

export interface TokenWinner<T extends Token> {
    token: T;
    score: number;
}

export interface Token {
    type: string;
    modifiers: string[];
    language?: string;
}

export interface SemanticToken extends Position, Token {}

export type Language = 'jsx' | 'js' | 'ts' | 'tsx';

export type FallbackRegister = (tokenString: string, fallbackScopes: string[]) => void;
