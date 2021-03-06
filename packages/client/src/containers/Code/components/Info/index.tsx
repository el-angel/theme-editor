import React from 'react';
import { createToken, matcher } from '@anche/semantic-tokens-utilities';
import { match } from '@anche/textmate-utilities';
import cx from 'classnames';
import {
    atom,
    DefaultValue,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

import { rulesState, ruleState } from '~/state/rules';
import { semanticTokensState } from '~/state/semanticTokens';
import { entitySettingsState } from '~/state/ui';

import { sublineSelected } from '~/containers/Code/components/CodeView';

import useAddEntity from '~/hooks/useAddEntity';
import useViewEntity from '~/hooks/useViewEntity';

import { EntityType } from '~/constants';

import { atomKey, selectorKey } from '~/helpers/state';

import { SemanticToken } from '~/types';

import css from './styles.module.scss';

import { activateRuleByScope } from '~/selectors/activateRule';

export const _textmateScopesState = atom<string[]>({
    key: atomKey('Info', 'TextMateScopes'),
    default: [],
});

export const _semanticTokenState = atom<string>({
    key: atomKey('Info', 'SemanticToken'),
    default: '',
});

interface InfoState {
    selected?: string;
    textmateScopes: string[];
    semanticToken: string;
}

export const infoState = selector<InfoState>({
    key: selectorKey('Info', 'Scopes'),
    get: ({ get }) => {
        const textmateScopes = get(_textmateScopesState);
        const semanticToken = get(_semanticTokenState);
        const selected = get(sublineSelected);

        return {
            selected,
            textmateScopes,
            semanticToken,
        };
    },
    set: ({ set, get, reset }, input) => {
        if (input instanceof DefaultValue) {
            set(_textmateScopesState, []);
            return;
        }

        const selected = get(sublineSelected);

        if (selected && !input.selected) {
            return;
        }

        if (selected === input.selected) {
            // deselect
            reset(sublineSelected);
            reset(_textmateScopesState);
            return;
        }

        set(sublineSelected, input.selected || '');
        set(_textmateScopesState, input.textmateScopes);
        set(_semanticTokenState, input.semanticToken);
    },
});

const Info: React.FC = () => {
    const definedRules = useRecoilValue(rulesState);
    const definedTokens = useRecoilValue(semanticTokensState);
    const viewEntity = useViewEntity();
    const { textmateScopes, semanticToken } = useRecoilValue(infoState);
    const activateRule = useSetRecoilState(activateRuleByScope);
    const input = useRecoilValue(entitySettingsState);

    const [activeRule, updateRule] = useRecoilState(ruleState(input?.id));

    const addEntity = useAddEntity();

    const onClickToken = async (token: string): Promise<void> => {
        const _tokens = definedTokens.map(_token => ({
            ..._token,
            ...createToken(_token.scope),
        }));
        const semanticToken = matcher.matchToken(token, _tokens);

        if (!semanticToken?.token) {
            const input = {
                scope: token,
            };

            const entity = await addEntity<SemanticToken>({
                input,
                filterScope: true,
                type: EntityType.SemanticToken,
            });

            viewEntity(entity);
        }
    };

    const onClickScope = (scope: string): void => {
        const rule = match(
            scope,
            definedRules.map(r => ({ rule: r, scopes: r.scope })),
        );

        if (rule) {
            activateRule(scope);
            return;
        }

        if (activeRule) {
            // there's a rule active in editing view
            // add this scope to that rule
            const regex = new RegExp(`^${scope}`);

            if (activeRule.scope.some(_scope => regex.test(_scope))) {
                return;
            }

            const splitted = scope.split('.');
            // remove extension from scope to support more language
            // otherwise theme will only work for this language
            splitted.pop();
            const formattedScope = splitted.join('.');

            updateRule({
                ...activeRule,
                scope: [formattedScope, ...activeRule.scope],
            });

            return;
        }

        const input = {
            scope: [scope],
        };

        addEntity({ input, filterScope: true, type: EntityType.Rule });
    };

    return (
        <div className={css.info}>
            {semanticToken && (
                <>
                    <p className={css.header}>semantic token</p>
                    <span
                        className={cx(css.scope, { [css.exists]: false })}
                        onClick={() => onClickToken(semanticToken)}
                    >
                        {semanticToken}
                    </span>
                </>
            )}
            {!!textmateScopes.length && (
                <>
                    <p className={css.header}>textmate scopes</p>
                    {[...textmateScopes].reverse().map((scope, i) => {
                        const exist = !!match(
                            scope,
                            definedRules.map(r => ({ rule: r, scopes: r.scope })),
                        );
                        return (
                            <span
                                className={cx(css.scope, { [css.exists]: exist })}
                                onClick={(): void => onClickScope(scope)}
                                key={`${scope}-${i}`}
                            >
                                {scope}
                            </span>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default Info;
