import { CodeDocument, Supplier } from '@anche/shared';
import { IGrammar, Registry } from 'monaco-textmate';
import { TextMateNode } from '~/types';

export interface Options<LanguageScopeNames extends string> {
    filePaths: {
        [scopeName in LanguageScopeNames]: string;
    };
}

type TextMateParserResult = { code: CodeDocument; tokens: TextMateNode[] };

class TextMateScopesParser<LSN extends string> implements Supplier<TextMateNode> {
    private _filePaths: Record<LSN, string>;
    private _registry: Registry;

    constructor(opts: Options<LSN>) {
        this._filePaths = opts.filePaths;

        this._registry = new Registry({
            getGrammarDefinition: this._getGrammarDefinition,
        });
    }

    private _getGrammarDefinition = async (
        scopeName: LSN,
    ): Promise<{ format: 'json' | 'plist'; content: string }> => {
        const grammar = await this._getLanguageFile(scopeName);

        let content, format;

        try {
            content = JSON.parse(grammar);
            format = 'json';
        } catch (_e) {
            content = grammar;
            format = 'plist';
        }

        return {
            format,
            content,
        };
    };

    private async _getLanguageFile(scopeName: LSN): Promise<string> {
        const response = await fetch(this._filePaths[scopeName]);

        if (!response.ok) {
            throw new Error('Something failed when doing a request to fetch the grammar file.');
        }

        const grammar = await response.text();

        return grammar;
    }

    private _typeCheck = (scopeName: string): scopeName is LSN => {
        const scopeNames = Object.keys(this._filePaths);

        if (scopeNames.includes(scopeName)) {
            return true;
        }

        return false;
    };

    public async loadGrammar(scopeName: LSN): Promise<IGrammar> {
        if (!this._typeCheck(scopeName)) {
            throw new Error(
                `"${scopeName}" grammar is not supported. Please add scopename and path to Options.filePaths.`,
            );
        }

        const grammar = await this._registry.loadGrammar(scopeName);
        return grammar;
    }

    public async parse(code: string, scopeName: LSN): Promise<TextMateParserResult> {
        const grammar = await this.loadGrammar(scopeName);

        const codeDocument = new CodeDocument({ code: code });

        const text = code.split('\n');

        const result = {
            code: codeDocument,
            tokens: [] as TextMateNode[],
        };

        let ruleStack;
        for (let i = 0; i < text.length; i++) {
            const line = text[i];
            const lineTokens = grammar!.tokenizeLine(line, ruleStack);

            for (let j = 0; j < lineTokens.tokens.length; j++) {
                const token = lineTokens.tokens[j];

                const node: TextMateNode = {
                    start: token.startIndex,
                    line: i,
                    length: token.endIndex - token.startIndex,
                    scopes: token.scopes.filter((e, i) => token.scopes.indexOf(e) === i),
                };

                result.tokens.push(node);
            }

            ruleStack = lineTokens.ruleStack;
        }

        return result;
    }
}

export { TextMateParserResult };
export { TextMateScopesParser };
