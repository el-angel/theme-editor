import React from 'react';
import { SubLine as SubLineType } from '@anche/textmate-grammar-parser';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';

import generalScopeManager from '~/state/generalScopes';

import getContrastColor from '~/helpers/getContrastColor';
import ruleMatch from '~/helpers/ruleMatch';

import { GeneralScope, Rule } from '~/types';

import css from './styles.module.scss';

type Props = SubLineType & {
  rules: Rule[];
  id: string;
  selected: boolean;
  onClick: (scopes: string[], rule: Rule, id: string) => void;
  onHover: (scopes: string[]) => void;
};

const getClass = (scopes: string, empty?: boolean): string => {
  const scopesSplit = (scopes || '').split('.');

  return cx(...scopesSplit, css.subline, {
    [css.empty]: empty,
  });
};

const SubLine: React.FC<Props> = ({ rules, scopes, content, selected, onClick, onHover, id }) => {
  const [activeScope, setActiveScope] = React.useState('');
  const [rule, setRule] = React.useState<Nullable<Rule>>(null);

  React.useEffect(() => {
    const activeRule = ruleMatch(rules, scopes);
    setRule(activeRule?.rule || null);
    setActiveScope(activeRule?.query || '');
  }, [scopes, rules]);

  const editorBackground = useRecoilValue(generalScopeManager('editor.background')) as GeneralScope;

  const empty = !content.trim();

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
      {content || ' '}
    </span>
  );
};

export default React.memo(SubLine);
