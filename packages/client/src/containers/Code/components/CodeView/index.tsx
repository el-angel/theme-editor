import React from 'react';
import cx from 'classnames';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useRecoilState } from 'recoil';

import parsedCode from '~/state/code';
import { getAllRules } from '~/state/rules';

import { infoState } from '~/containers/Code/components/Info';
import Line from '~/containers/Code/components/Line';
import SubLine from '~/containers/Code/components/SubLine';

import useViewRule from '~/hooks/useViewRule';

import { Rule } from '~/types';

import css from './styles.module.scss';

export const sublineSelected = atom<string>({
  key: 'selectedSubline',
  default: '',
});

const CodeView: React.FC = () => {
  const rules = useRecoilValue(getAllRules);
  const codeObj = useRecoilValue(parsedCode);
  const [selected, setSelected] = useRecoilState(sublineSelected);
  const setInfoScopes = useSetRecoilState(infoState);
  const viewRule = useViewRule();

  const onHoverSubline = React.useCallback(
    (scopes: string[]): void => {
      setInfoScopes(scopes);
    },
    [setInfoScopes],
  );

  const onClickSubline = React.useCallback(
    (scopes: string[], rule: Rule, id: string, isSelected: boolean): void => {
      viewRule(rule || '');

      if (!isSelected) {
        setSelected(id);
        setInfoScopes(scopes);
        return;
      }

      setSelected('');
      setInfoScopes([]);
    },
    [setInfoScopes, setSelected, viewRule],
  );

  return (
    <>
      <span className={cx(css.lineNumbers)}>
        {codeObj.lines.map((_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </span>
      <span>
        {codeObj.lines.map(line => (
          <Line key={line.number} lineNumber={line.number}>
            {line.content.map((subline, i) => {
              const sublineKey = `${line.number}-"${subline.content}"-${i}`;
              return (
                <SubLine
                  rules={rules}
                  selected={sublineKey === selected}
                  key={sublineKey}
                  id={sublineKey}
                  onHover={onHoverSubline}
                  onClick={onClickSubline}
                  {...subline}
                />
              );
            })}
          </Line>
        ))}
      </span>
    </>
  );
};

export default CodeView;
