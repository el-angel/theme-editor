import React from 'react';
import { useRecoilState } from 'recoil';

import generalScopeManager from '~/state/generalScopes';
import editGeneralScopeState from '~/state/generalScopes/edit';

import ColorPicker from '~/containers/Settings/components/ColorPicker';
import NameInput from '~/containers/Settings/components/NameInput';
import Swatches from '~/containers/Settings/components/Swatches';

import Panel from '~/components/ui/Panel';

import css from './styles.module.scss';

const GeneralSettings: React.FC = () => {
  const [scope, setScope] = useRecoilState(editGeneralScopeState);

  const [generalScope, updateGeneralScope] = useRecoilState(generalScopeManager(scope));

  const onChangeColor = React.useCallback(
    (color: string) => {
      updateGeneralScope({
        ...generalScope!,
        color,
      });
    },
    [updateGeneralScope, generalScope],
  );

  if (!generalScope || !scope) {
    return null;
  }

  return (
    <Panel onClose={(): void => setScope(undefined)}>
      <div className={css.left}>
        <NameInput readonly value={generalScope.scope} />
      </div>
      <div className={css.tools}>
        <ColorPicker value={generalScope.color} onChange={onChangeColor} />
      </div>
      <div className={css.colorContainer}>
        <Swatches
          color={generalScope.color}
          onColorSelect={(color): void => onChangeColor(color)}
        />
      </div>
    </Panel>
  );
};
export default GeneralSettings;
