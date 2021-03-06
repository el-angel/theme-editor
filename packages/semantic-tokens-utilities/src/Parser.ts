import { CodeDocument, Parser } from '@anche/shared';
import ts from 'typescript/lib/tsserverlibrary';
import { TokenEncodingConsts } from 'typescript-vscode-sh-plugin/lib/constants';
import initPlugin from 'typescript-vscode-sh-plugin';

import createTypeScriptService from './TypeScriptService';

import { tokenTypes, tokenModifiers } from './constants/tokens';
import { SemanticToken, Language } from './types';

export interface Input {
    code: string;
    language: Language;
}

const _createTypeScript = ({
    code,
    language,
}: Input): { service: ts.LanguageService; host: ts.LanguageServiceHost } => {
    const host = createTypeScriptService({
        code,
        language,
    });

    const textmateService = ts.createLanguageService(host);
    return {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        service: initPlugin({ typescript: ts }).decorate(textmateService),
        host,
    };
};

const _getTokenTypeIndex = (classification: number): number | undefined => {
    if (classification > TokenEncodingConsts.modifierMask) {
        return (classification >> TokenEncodingConsts.typeOffset) - 1;
    }
    return undefined;
};

const _getTokenModifierSet = (classification: number): number =>
    classification & TokenEncodingConsts.modifierMask;

const Parser: Parser<SemanticToken> = ({ code, language }: Input) => {
    const codeDocument = new CodeDocument({ code });

    const { service, host } = _createTypeScript({ code, language });

    const program = service.getProgram();

    const fileName = host.getScriptFileNames()[0];
    const sourceFile = program.getSourceFile(fileName);

    const span = { start: 0, length: codeDocument.length() };
    const result = service.getEncodedSemanticClassifications(fileName, span);

    const tokens: SemanticToken[] = [];

    let i = 0;
    while (i < result.spans.length) {
        const start = result.spans[i++];

        const length = result.spans[i++];
        const classification = result.spans[i++];
        const position = sourceFile.getLineAndCharacterOfPosition(start);

        const typeIndex = _getTokenTypeIndex(classification) || 0;
        const modifierSet = _getTokenModifierSet(classification);

        tokens.push({
            line: position.line,
            start: position.character,
            length,
            type: tokenTypes[typeIndex],
            modifiers: tokenModifiers.filter((_, i) => modifierSet & (1 << i)),
            language: undefined,
        });
    }

    return {
        code: codeDocument,
        tokens,
    };
};

type SemanticTokensParserResult = ReturnType<Parser<SemanticToken>>;
export { SemanticTokensParserResult };

export default Parser;
