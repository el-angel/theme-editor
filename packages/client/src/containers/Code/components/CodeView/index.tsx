import React from 'react';
import { createToken, matcher } from '@anche/semantic-tokens-utilities';
import { match } from '@anche/textmate-utilities';
import cx from 'classnames';
import { sortBy } from 'lodash';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { selector, useRecoilState } from 'recoil';

import parsedCode from '~/state/code';
import { getRules } from '~/state/rules';
import { semanticTokens, semanticTokensState } from '~/state/semanticTokens';

import { infoState } from '~/containers/Code/components/Info';
import Line from '~/containers/Code/components/Line';
import SubLine, { SubLineCallback } from '~/containers/Code/components/SubLine';

// import useViewRule from '~/hooks/useViewRule';
import useViewEntity from '~/hooks/useViewEntity';

import { selectorKey } from '~/helpers/state';

import css from './styles.module.scss';

export const sublineSelected = atom<string>({
    key: 'selectedSubline',
    default: '',
});

type FormattedNode = Pick<
    React.ComponentProps<typeof SubLine>,
    'children' | 'semanticTokenStateId' | 'ruleStateId' | 'scopes' | 'semanticToken'
>;

const hydratedCode = selector({
    key: selectorKey('CodeView', 'Format'),
    get: ({ get }) => {
        const textMateResult = get(parsedCode);
        const semanticTokenResult = get(semanticTokens);
        const definedRules = get(getRules);
        const definedTokens = get(semanticTokensState);

        const lines = textMateResult.code.getLines();
        const sorted = sortBy(textMateResult.tokens, ['line', 'start']);

        const formatted: FormattedNode[][] = [];

        sorted.forEach(textMateScope => {
            const line = lines[textMateScope.line];

            const semanticToken =
                semanticTokenResult &&
                semanticTokenResult[textMateScope.line] &&
                semanticTokenResult[textMateScope.line][textMateScope.start];

            const tokens = definedTokens.map(_token => ({
                ..._token,
                ...createToken(_token.scope),
            }));

            const semanticTokenScope =
                semanticToken && matcher.matchToken(semanticToken[0], tokens);

            const nodeScopes: string[] = semanticTokenScope?.fallbackScopes || textMateScope.scopes;

            const rule = match(
                nodeScopes,
                definedRules.map(r => ({ rule: r, scopes: r.scope })),
            );

            const subline: FormattedNode = {
                ...textMateScope,
                children: line.substr(textMateScope.start, textMateScope.length),
                // add state ids so SubLine component can subscribe to those recoil values
                semanticToken,
                semanticTokenStateId: semanticTokenScope?.token?.id,
                ruleStateId: rule?.rule.id,
            };

            if (!formatted[textMateScope.line]) {
                formatted[textMateScope.line] = [];
            }

            formatted[textMateScope.line].push(subline);
        });

        return formatted;
    },
});

const CodeView: React.FC = () => {
    const codeObj = useRecoilValue(hydratedCode);
    const [selected] = useRecoilState(sublineSelected);
    const setInfoState = useSetRecoilState(infoState);
    const viewEntity = useViewEntity();

    const subLineCallback: SubLineCallback = React.useCallback(
        ({ textmateScopes, semanticToken, id, entity }) => {
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
                            const sublineKey = `${i}-"${subline.children}"-${j}`;

                            return (
                                <SubLine
                                    selected={sublineKey === selected}
                                    key={sublineKey}
                                    id={sublineKey}
                                    onHover={subLineCallback}
                                    onClick={subLineCallback}
                                    {...subline}
                                >
                                    {subline.children || ''}
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
