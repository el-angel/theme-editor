import React from 'react';
import {
    createTokenString,
    SemanticToken as ExternalSemanticToken,
} from '@anche/semantic-tokens-utilities';
import cx from 'classnames';
import { selectorFamily, useRecoilValue } from 'recoil';

import { generalScopeState } from '~/state/generalScopes';
import { ruleState } from '~/state/rules';
import { semanticTokenState } from '~/state/semanticTokens';

import { EntityType, FontStyle } from '~/constants';

import getContrastColor from '~/helpers/getContrastColor';

import { GeneralScope, Rule, SemanticToken } from '~/types';

import css from './styles.module.scss';

export type SubLineCallback = (args: {
    textmateScopes: string[];
    semanticToken: string;
    id?: string;
    entity?: Rule | SemanticToken;
}) => void;

type Props = {
    scopes: string[];
    id: string;
    selected: boolean;
    onClick: SubLineCallback;
    onHover: SubLineCallback;
    semanticToken?: ExternalSemanticToken[];
    children: string;
    semanticTokenStateId: Maybe<string>;
    ruleStateId: Maybe<string>;
};

const getClass = (empty?: boolean): string =>
    cx(css.subline, {
        [css.empty]: empty,
    });

const entitySelector = selectorFamily<
    SemanticToken | Rule,
    { id: Maybe<string>; type: EntityType }
>({
    key: 'ENTITY_SELECTOR',
    get: ({ id, type }: { id: Maybe<string>; type: EntityType }) => ({
        get,
    }): SemanticToken | Rule => {
        if (type === EntityType.SemanticToken) {
            return get(semanticTokenState(id));
        }

        return get(ruleState(id || ''));
    },
});

const SubLine: React.FC<Props> = ({
    scopes,
    selected,
    onClick,
    onHover,
    id,
    children,
    semanticTokenStateId,
    semanticToken,
    ruleStateId,
}) => {
    const entity = useRecoilValue(
        entitySelector({
            id: semanticTokenStateId || ruleStateId,
            type: semanticTokenStateId ? EntityType.SemanticToken : EntityType.Rule,
        }),
    );

    const editorBackground = useRecoilValue(generalScopeState('editor.background')) as GeneralScope;

    const empty = !children.trim();
    const semanticTokenStr = semanticToken ? createTokenString(semanticToken[0]) : '';

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
                              textmateScopes: scopes,
                              entity,
                              id,
                              semanticToken: semanticTokenStr,
                          }),
                      onMouseEnter: (): void =>
                          onHover({
                              textmateScopes: scopes,
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
