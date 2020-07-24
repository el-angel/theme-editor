import React from 'react';
import { SemanticToken } from '@anche/semantic-highlighting-parser';
// import { SubLine as SubLineType } from '@anche/textmate-grammar-parser';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import generalScopeManager from '~/state/generalScopes';

import { SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP } from '~/constants';

import getContrastColor from '~/helpers/getContrastColor';
import ruleMatch from '~/helpers/ruleMatch';
import getSemanticTokenFallback from '~/helpers/semanticTokenFallback';

import { GeneralScope, Rule } from '~/types';

import css from './styles.module.scss';

type Props = {
    scopes: string[];
    rules: Rule[];
    id: string;
    selected: boolean;
    onClick: (scopes: string[], rule: Rule, id: string) => void;
    onHover: (scopes: string[]) => void;
    semanticToken?: SemanticToken;
    children: string;
};

const getClass = (scopes: string, empty?: boolean): string => {
    const scopesSplit = (scopes || '').split('.');

    return cx(...scopesSplit, css.subline, {
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
}) => {
    const [activeScope, setActiveScope] = React.useState('');
    const [rule, setRule] = React.useState<Nullable<Rule>>(null);
    const [scopes, setScopes] = React.useState<string[]>(_scopes);

    React.useEffect(() => {
        if (semanticToken) {
            const token = [semanticToken.type, semanticToken.modifiers].filter(a => !!a).join('.');
            setScopes([token]);
        } else {
            setScopes(_scopes);
        }
    }, [_scopes, semanticToken]);

    React.useEffect(() => {
        let matchScopes = scopes;

        if (semanticToken && matchScopes.length === 1) {
            const semanticTokenScope = getSemanticTokenFallback(scopes[0]);
            console.log({ semanticTokenScope });
            matchScopes = [semanticTokenScope || ''];
        }

        const activeRule = ruleMatch(rules, matchScopes);
        setRule(activeRule?.rule || null);
        setActiveScope(activeRule?.query || '');
    }, [scopes, rules, semanticToken]);

    const editorBackground = useRecoilValue(
        generalScopeManager('editor.background'),
    ) as GeneralScope;

    const empty = !children.trim();

    return (
        <span
            className={cx(getClass(activeScope, empty))}
            style={
                selected
                    ? {
                          backgroundColor: `${getContrastColor(editorBackground.color)}20`,
                      }
                    : {}
            }
            {...(!empty
                ? {
                      onClick: (): void => onClick(scopes, rule!, id),
                      onMouseEnter: (): void => onHover(scopes),
                  }
                : {})}
        >
            {children || ' '}
        </span>
    );
};

export default React.memo(SubLine);
