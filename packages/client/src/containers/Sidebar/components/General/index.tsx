import React from 'react';

import GeneralScope from '~/containers/Sidebar/components/GeneralScope';

import { GENERAL_SCOPES } from '~/constants';

const General: React.FC = () => {
  return (
    <>
      {GENERAL_SCOPES.map(scope => (
        <GeneralScope scope={scope} key={scope} />
      ))}
    </>
  );
};

export default General;
