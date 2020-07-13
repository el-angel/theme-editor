import React from 'react';
import { useRecoilValue } from 'recoil';

import mode from '~/state/mode';

import GeneralSettings from '~/containers/Settings/GeneralSettings';
import RuleSettings from '~/containers/Settings/RuleSettings';

const Settings: React.FC = () => {
  const currentMode = useRecoilValue(mode);

  if (currentMode === 'general') {
    return <GeneralSettings />;
  }

  return <RuleSettings />;
};

export default Settings;
