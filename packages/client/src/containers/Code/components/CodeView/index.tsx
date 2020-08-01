import React from 'react';
import { SemanticToken as ExternalSemanticToken } from '@anche/semantic-highlighting-parser';
import { TextMateNode } from '@anche/textmate-grammar-parser';
import cx from 'classnames';
import { groupBy, sortBy } from 'lodash';
import { atom, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { selector, useRecoilState } from 'recoil';

import parsedCode from '~/state/code';
import { getRules } from '~/state/rules';
import { semanticTokens, semanticTokensState } from '~/state/semanticTokens';

import { infoState } from '~/containers/Code/components/Info';
import Line from '~/containers/Code/components/Line';
import SubLine from '~/containers/Code/components/SubLine';

// import useViewRule from '~/hooks/useViewRule';
import useViewEntity from '~/hooks/useViewEntity';

import { selectorKey } from '~/helpers/state';

import { SemanticToken } from '~/types';
import { Rule } from '~/types';

import css from './styles.module.scss';

export const sublineSelected = atom<string>({
    key: 'selectedSubline',
    default: '',
});

interface FormattedNode extends TextMateNode {
    content: string;
}

const groupSemanticTokens = (
    array: ExternalSemanticToken[],
): Record<number, Record<number, ExternalSemanticToken[]>> => {
    if (!array.length) {
        return {};
    }
    const _grouped = groupBy(array, 'line');

    const grouped: Record<number, Record<number, ExternalSemanticToken[]>> = {};

    Object.keys(_grouped).forEach(lineNumber => {
        grouped[lineNumber] = groupBy(_grouped[lineNumber], 'start');
    });

    return grouped;
};

const hydratedCode = selector({
    key: selectorKey('CodeView', 'Format'),
    get: ({ get }) => {
        const textMateResult = get(parsedCode);

        const lines = textMateResult.code.getLines();
        const sorted = sortBy(textMateResult.tokens, ['line', 'start']);

        const formatted: FormattedNode[][] = [];

        sorted.forEach(token => {
            const line = lines[token.line];

            const subline: FormattedNode = {
                ...token,
                content: line.substr(token.start, token.length),
            };

            if (!formatted[token.line]) {
                formatted[token.line] = [];
            }

            formatted[token.line].push(subline);
        });

        return formatted;
    },
});

const CodeView: React.FC = () => {
    const definedRules = useRecoilValue(getRules);
    const definedTokens = useRecoilValue(semanticTokensState);
    const codeObj = useRecoilValue(hydratedCode);
    const [selected] = useRecoilState(sublineSelected);
    const setInfoState = useSetRecoilState(infoState);
    const viewEntity = useViewEntity();

    const tokens = useRecoilValueLoadable(semanticTokens);
    const semanticTokensGrouped =
        tokens.state === 'hasValue' ? groupSemanticTokens(tokens?.contents?.tokens || []) : {};

    const onHoverSubline = React.useCallback(
        ({
            textmateScopes,
            semanticToken,
        }: {
            textmateScopes: string[];
            semanticToken: string;
        }): void => {
            setInfoState({
                textmateScopes,
                semanticToken,
            });
        },
        [setInfoState],
    );

    const onClickSubline = React.useCallback(
        ({
            textmateScopes,
            entity,
            id,
            semanticToken,
        }: {
            textmateScopes: string[];
            entity: Rule | SemanticToken | null;
            id: string;
            semanticToken: string;
        }): void => {
            entity && viewEntity(entity);

            setInfoState({
                selected: id,
                textmateScopes,
                semanticToken,
            });
        },
        [setInfoState, viewEntity],
    );

    return (
        <>
            <span className={cx(css.lineNumbers)}>
                {codeObj.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                ))}
            </span>
            <span>
                {codeObj.map((line, i) => (
                    <Line key={i} lineNumber={i}>
                        {line.map((subline, j) => {
                            const semanticToken =
                                semanticTokensGrouped[i] && semanticTokensGrouped[i][subline.start];
                            const sublineKey = `${i}-"${subline.content}"-${j}`;

                            return (
                                <SubLine
                                    rules={definedRules}
                                    semanticTokens={definedTokens}
                                    selected={sublineKey === selected}
                                    key={sublineKey}
                                    id={sublineKey}
                                    onHover={onHoverSubline}
                                    onClick={onClickSubline}
                                    semanticToken={semanticToken && semanticToken[0]}
                                    {...subline}
                                >
                                    {subline.content}
                                </SubLine>
                            );
                        })}
                    </Line>
                ))}
            </span>
        </>
    );
};

export default CodeView;
