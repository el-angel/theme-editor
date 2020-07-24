import React from 'react';
import cx from 'classnames';
import {
    atom,
    DefaultValue,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

import ruleManager, { getAllRules } from '~/state/rules';
import editRuleState from '~/state/rules/edit';

import { sublineSelected } from '~/containers/Code/components/CodeView';

import useAddRule from '~/hooks/useAddRule';

import ruleMatch from '~/helpers/ruleMatch';

import css from './styles.module.scss';

import { activateRuleByScope } from '~/selectors/activateRule';

export const _infoState = atom<string[]>({
    key: 'scopesInfoState',
    default: [],
});

interface InfoState {
    selected?: string;
    scopes: string[];
}

export const infoState = selector<InfoState>({
    key: 'scopesInfoSelector',
    get: ({ get }) => {
        const scopes = get(_infoState);
        const selected = get(sublineSelected);

        return {
            selected,
            scopes,
        };
    },
    set: ({ set, get, reset }, input) => {
        if (input instanceof DefaultValue) {
            return;
        }

        const selected = get(sublineSelected);

        if (selected && !input.selected) {
            return;
        }

        if (selected === input.selected) {
            // deselect
            reset(sublineSelected);
            reset(_infoState);
            return;
        }

        set(sublineSelected, input.selected || '');
        set(_infoState, input.scopes);
    },
});

const Info: React.FC = () => {
    const definedRules = useRecoilValue(getAllRules);
    const { scopes } = useRecoilValue(infoState);
    const activateRule = useSetRecoilState(activateRuleByScope);
    const id = useRecoilValue(editRuleState);

    const [activeRule, updateRule] = useRecoilState(ruleManager(id));

    const addRule = useAddRule();

    const onClickScope = (scope: string): void => {
        const rule = ruleMatch(definedRules, [scope]);

        if (rule) {
            activateRule(scope);
            return;
        }

        if (activeRule) {
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

        addRule({ scope: [scope] }, true);
    };

    if (!scopes.length) {
        return null;
    }

    return (
        <code className={css.info}>
            {[...scopes].reverse().map((scope, i) => {
                const exist = !!ruleMatch(definedRules, [scope]);
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
        </code>
    );
};

export default Info;
