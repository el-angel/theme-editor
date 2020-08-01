import { TokenType, TokenModifier } from 'typescript-vscode-sh-plugin/lib/constants';

export const tokenTypes: string[] = [];
tokenTypes[TokenType.class] = 'class';
tokenTypes[TokenType.enum] = 'enum';
tokenTypes[TokenType.interface] = 'interface';
tokenTypes[TokenType.namespace] = 'namespace';
tokenTypes[TokenType.typeParameter] = 'typeParameter';
tokenTypes[TokenType.type] = 'type';
tokenTypes[TokenType.parameter] = 'parameter';
tokenTypes[TokenType.variable] = 'variable';
tokenTypes[TokenType.enumMember] = 'enumMember';
tokenTypes[TokenType.property] = 'property';
tokenTypes[TokenType.function] = 'function';
tokenTypes[TokenType.member] = 'member';

export const tokenModifiers: string[] = [];
tokenModifiers[TokenModifier.declaration] = 'declaration';
tokenModifiers[TokenModifier.static] = 'static';
tokenModifiers[TokenModifier.async] = 'async';
tokenModifiers[TokenModifier.readonly] = 'readonly';
tokenModifiers[TokenModifier.defaultLibrary] = 'defaultLibrary';
tokenModifiers[TokenModifier.local] = 'local';
