import { IGrammar, Registry } from 'monaco-textmate';
import initialize from './init';

type Scope = string;

export interface SubLine {
  content: string;
  scopes: Scope[];
}
export interface Line {
  number: number;
  content: SubLine[];
}
export interface Code {
  scopeName: string;
  lines: Line[];
}

export interface Options<LanguageScopeNames extends string> {
  filePaths: {
    [scopeName in LanguageScopeNames]: string;
  };
}

class GrammarHelper<LSN extends string> {
  private _filePaths: Record<LSN, string>;
  private _registry: Registry;

  constructor(opts: Options<LSN>) {
    this._filePaths = opts.filePaths;

    this._registry = new Registry({
      getGrammarDefinition: this._getGrammarDefinition,
    });
  }

  private _getGrammarDefinition = async (
    scope: LSN,
  ): Promise<{ format: 'json'; content: string }> => {
    const language = await this._getLanguage(scope);
    return {
      format: 'json',
      content: language,
    };
  };

  private async _getLanguage(scope: LSN): Promise<string> {
    const response = await fetch(this._filePaths[scope]);

    if (!response.ok) {
      throw new Error('Something failed when doing a request to fetch the grammar file.');
    }

    const grammar = await response.text();

    return JSON.parse(grammar);
  }

  private _typeCheck = (scope: string): scope is LSN => {
    const scopes = Object.keys(this._filePaths);

    if (scopes.includes(scope)) {
      return true;
    }

    return false;
  };

  public async loadGrammar(scope: LSN): Promise<IGrammar> {
    if (!this._typeCheck(scope)) {
      throw new Error(
        `"${scope}" grammar is not supported. Please add scopename and path to Options.filePaths.`,
      );
    }

    const grammar = await this._registry.loadGrammar(scope);
    return grammar;
  }

  public async parse(_code: string, scope: LSN): Promise<Code> {
    const grammar = await this.loadGrammar(scope);

    const text = _code.split('\n');

    const code: Code = {
      scopeName: scope,
      lines: [],
    };

    let ruleStack;
    for (let i = 0; i < text.length; i++) {
      const line = text[i];
      const lineTokens = grammar!.tokenizeLine(line, ruleStack);

      const formattedLine: Line = {
        number: i,
        content: [],
      };

      for (let j = 0; j < lineTokens.tokens.length; j++) {
        const token = lineTokens.tokens[j];

        const linePart: SubLine = {
          content: line.substring(token.startIndex, token.endIndex),
          scopes: token.scopes.filter((e, i) => token.scopes.indexOf(e) === i),
        };

        formattedLine.content.push(linePart);
      }

      code.lines.push(formattedLine);

      ruleStack = lineTokens.ruleStack;
    }

    return code;
  }
}

export { GrammarHelper };
export { initialize };
