import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import ruleManager, { getAllRules } from '~/state/rules';
import editRuleState from '~/state/rules/edit';

import ColorPicker from '~/containers/Settings/components/ColorPicker';
import FontStyle from '~/containers/Settings/components/FontStyle';
import NameInput from '~/containers/Settings/components/NameInput';
import ScopesList from '~/containers/Settings/components/ScopesList';
import Swatches from '~/containers/Settings/components/Swatches';

import Button from '~/components/ui/Button';
import Panel from '~/components/ui/Panel';

import useDeleteRule from '~/hooks/useDeleteRule';
import useViewRule from '~/hooks/useViewRule';

import { FONT_STYLE } from '~/constants';

import getExistingScopes from '~/helpers/getExistingScopes';

import css from './styles.module.scss';

const NEW_SCOPE_KEYS = ['Enter', ','];

const RuleSettings: React.FC = () => {
  const rules = useRecoilValue(getAllRules);
  const deleteRule = useDeleteRule();
  const setViewRule = useViewRule();
  const id = useRecoilValue(editRuleState);
  const rule = useRecoilValue(ruleManager(id));

  const updateRule = useSetRecoilState(ruleManager(id));

  const [newScope, setNewScope] = React.useState<string>('');

  const toggleFontStyle = React.useCallback(
    (fontStyle: typeof FONT_STYLE[keyof typeof FONT_STYLE]) => {
      let styles = [...rule!.settings.fontStyle] || [];

      if (typeof styles === 'string') {
        styles = [styles];
      }

      if (styles.includes(fontStyle)) {
        styles.splice(styles.indexOf(fontStyle), 1);
      } else {
        styles.push(fontStyle);
      }

      updateRule!({
        ...rule!,
        settings: {
          ...rule!.settings,
          fontStyle: styles,
        },
      });
    },
    [updateRule, rule],
  );

  const onChangeColor = React.useCallback(
    (color: string) => {
      updateRule!({
        ...rule!,
        settings: {
          ...rule!.settings,
          foreground: color,
        },
      });
    },
    [updateRule, rule],
  );

  const onAddScopeInputChange = React.useCallback(
    (evt: React.ChangeEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      setNewScope(evt.target.value);
    },
    [setNewScope],
  );

  const onAddScopeInputKeyDown = React.useCallback(
    (evt: React.KeyboardEvent) => {
      if (NEW_SCOPE_KEYS.includes(evt.key)) {
        evt.preventDefault();

        updateRule({
          ...rule!,
          scope: [newScope, ...rule!.scope],
        });

        setNewScope('');
      }
    },
    [updateRule, rule, newScope],
  );

  if (!rule?.id) {
    return null;
  }

  return (
    <Panel onClose={(): void => setViewRule()}>
      <div className={css.container}>
        <div className={css.top}>
          <div className={css.left}>
            <div>
              <NameInput
                value={rule.name}
                onChange={(name): void => updateRule({ ...rule, name })}
              />
              <div className={css.scopesList}>
                <ScopesList
                  existingScopes={getExistingScopes(rule, rules)}
                  scopes={rule.scope}
                  onDelete={(scope: string): void => {
                    const index = rule.scope.findIndex(sc => sc === scope);
                    const newScopes = [...rule.scope];
                    newScopes.splice(index, 1);
                    updateRule({
                      ...rule,
                      scope: newScopes,
                    });
                  }}
                />
              </div>
            </div>
            <Button onClick={(): void => deleteRule(rule)}>Delete</Button>
          </div>
          <div className={css.tools}>
            <div className={css.picker}>
              <ColorPicker value={rule.settings.foreground} onChange={onChangeColor} />
            </div>
            <FontStyle
              type={FONT_STYLE.BOLD}
              onClick={(): void => toggleFontStyle(FONT_STYLE.BOLD)}
              enabled={rule.settings.fontStyle?.includes(FONT_STYLE.BOLD) || false}
            />
            <FontStyle
              type={FONT_STYLE.ITALIC}
              onClick={(): void => toggleFontStyle(FONT_STYLE.ITALIC)}
              enabled={rule.settings.fontStyle?.includes(FONT_STYLE.ITALIC) || false}
            />
            <FontStyle
              type={FONT_STYLE.UNDERLINE}
              onClick={(): void => toggleFontStyle(FONT_STYLE.UNDERLINE)}
              enabled={rule.settings.fontStyle?.includes(FONT_STYLE.UNDERLINE) || false}
            />
          </div>
          <div className={css.colorContainer}>
            <Swatches
              color={rule.settings.foreground}
              onColorSelect={(color): void => onChangeColor(color)}
            />
          </div>
        </div>
        <div className={css.addScope}>
          <input
            className={css.addScopeInput}
            type="text"
            placeholder="Add scope"
            value={newScope}
            onChange={onAddScopeInputChange}
            onKeyDown={onAddScopeInputKeyDown}
          />
        </div>
      </div>
    </Panel>
  );
};

export default RuleSettings;
