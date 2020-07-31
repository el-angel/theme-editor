import React from 'react';
import { SemanticToken as ExternalSemanticToken } from '@anche/semantic-highlighting-parser';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import { getGeneralScope } from '~/state/generalScopes';

import { createTokenString, getSemanticTokenRule } from '~/services/semanticToken';

import { FontStyle } from '~/constants';

import getContrastColor from '~/helpers/getContrastColor';
import getTextmateScopesRule from '~/helpers/ruleMatch';

import { GeneralScope, Rule, SemanticToken } from '~/types';

import css from './styles.module.scss';

type Props = {
    scopes: string[];
    rules: Rule[];
    semanticTokens: SemanticToken[];
    id: string;
    selected: boolean;
    onClick: (args: {
        textmateScopes: string[];
        semanticToken: string;
        entity: Rule | SemanticToken | null;
        id: string;
    }) => void;
    onHover: (args: { textmateScopes: string[]; semanticToken: string }) => void;
    semanticToken?: ExternalSemanticToken;
    children: string;
};

const getClass = (empty?: boolean): string => {
    // const scopesSplit = (scopes || '').split('.');

    return cx(css.subline, {
        [css.empty]: empty,
    });
};

const SubLine: React.FC<Props> = ({
    rules,
    scopes: _scopes,
    selected,
    onClick,
    onHover,
    id,
    children,
    semanticToken,
    semanticTokens,
}) => {
    const [entity, setEntity] = React.useState<Nullable<Rule | SemanticToken>>(null);
    const [scopes, setScopes] = React.useState<string[]>(_scopes);

    React.useEffect(() => {
        if (semanticToken) {
            const token = createTokenString(semanticToken);
            setScopes([token]);
        } else {
            setScopes(_scopes);
        }
    }, [_scopes, semanticToken]);

    React.useEffect(() => {
        let matchScopes = scopes;

        if (semanticToken) {
            const semanticTokenScope = getSemanticTokenRule(semanticTokens, scopes[0]);
            if (semanticTokenScope?.semanticToken) {
                setEntity(semanticTokenScope.semanticToken);
                return;
            }

            if (semanticTokenScope?.fallbackScopes) {
                matchScopes = semanticTokenScope?.fallbackScopes;
            }
        }

        const activeRule = getTextmateScopesRule(rules, matchScopes);
        setEntity(activeRule?.rule || null);
    }, [scopes, rules, semanticToken, children, semanticTokens]);

    const editorBackground = useRecoilValue(getGeneralScope('editor.background')) as GeneralScope;

    const empty = !children.trim();
    const semanticTokenStr = semanticToken ? createTokenString(semanticToken) : '';

    const style: React.CSSProperties = {
        color: entity?.settings.foreground,
        fontWeight: entity?.settings.fontStyle?.includes(FontStyle.Bold) ? 'bold' : 'normal',
        fontStyle: entity?.settings.fontStyle?.includes(FontStyle.Italic) ? 'italic' : 'normal',
        textDecoration: entity?.settings.fontStyle?.includes(FontStyle.Underline)
            ? 'underline'
            : 'none',
        ...(selected
            ? {
                  backgroundColor: `${getContrastColor(editorBackground.settings.foreground)}20`,
              }
            : {}),
    };

    return (
        <span
            className={cx(getClass(empty))}
            style={style}
            {...(!empty
                ? {
                      onClick: (): void =>
                          onClick({
                              textmateScopes: _scopes,
                              entity,
                              id,
                              semanticToken: semanticTokenStr,
                          }),
                      onMouseEnter: (): void =>
                          onHover({
                              textmateScopes: _scopes,
                              semanticToken: semanticTokenStr,
                          }),
                  }
                : {})}
        >
            {children || ' '}
        </span>
    );
};

export default React.memo(SubLine);
