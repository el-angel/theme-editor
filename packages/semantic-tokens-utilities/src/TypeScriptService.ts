import path from 'path';
import ts from 'typescript/lib/tsserverlibrary';
import { WORKING_FILENAME } from '~/constants';
import { Input } from './Parser';

const compilerOptions: ts.CompilerOptions = {
    allowNonTsExtensions: true,
    allowJs: true,
    lib: ['lib.es6.d.ts'],
    target: ts.ScriptTarget.Latest,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    jsx: ts.JsxEmit.React,
    allowSyntheticDefaultImports: true,
    types: ['node'],
};

const createTypeScriptService = ({ language, code }: Input): ts.LanguageServiceHost => {
    if (!['jsx', 'js', 'ts', 'tsx'].includes(language)) {
        throw new Error(`Language: "${language}" is not supported.`);
    }

    const sourceRoot = __dirname; // use the current directory as root for all test files to enable module lookup
    const file = `${WORKING_FILENAME}.${language}`;
    const filePath = `${sourceRoot}${file}`;

    function findFilePath(moduleName: string): string | undefined {
        if (file.startsWith(moduleName + '.')) {
            return sourceRoot + file;
        }
        return undefined;
    }

    const host: ts.LanguageServiceHost = {
        getCompilationSettings: () => compilerOptions,
        getScriptFileNames: () => [filePath],
        getScriptKind: _fileName => {
            const ext = path.extname(_fileName);

            switch (ext) {
                case '.jsx':
                    return ts.ScriptKind.JSX;
                case '.tsx':
                    return ts.ScriptKind.TSX;
                case '.js':
                    return ts.ScriptKind.JS;
                default:
                    return ts.ScriptKind.TS;
            }
        },
        getScriptVersion: (_fileName: string): string => '1',
        getScriptSnapshot: (fileName: string) => {
            let text: string;
            if (fileName.startsWith(sourceRoot)) {
                text = code;
            } else {
                text = ts.sys.readFile(fileName) || '';
            }
            return {
                getText: (start, end): string => text.substring(start, end),
                getLength: (): number => text.length,
                getChangeRange: (): undefined => undefined,
            };
        },
        getCurrentDirectory: () => __dirname,
        getDirectories: ts.sys.getDirectories,
        getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
        resolveModuleNames: (
            moduleNames: string[],
            containingFile: string,
        ): (ts.ResolvedModule | undefined)[] => {
            const resolvedModules: (ts.ResolvedModule | undefined)[] = [];
            for (const moduleName of moduleNames) {
                if (moduleName.startsWith('./')) {
                    let resolvedFileName = findFilePath(moduleName.substring(2));
                    if (!resolvedFileName) {
                        resolvedFileName = path.join(
                            path.dirname(containingFile),
                            moduleName + '.ts',
                        );
                    }
                    resolvedModules.push({ resolvedFileName });
                } else {
                    const result = ts.resolveModuleName(
                        moduleName,
                        containingFile,
                        compilerOptions,
                        {
                            fileExists: ts.sys.fileExists,
                            readFile: ts.sys.readFile,
                        },
                    );
                    if (result.resolvedModule) {
                        resolvedModules.push(result.resolvedModule);
                    } else {
                        resolvedModules.push(undefined);
                    }
                }
            }
            return resolvedModules;
        },
    };

    return host;
};

export default createTypeScriptService;
