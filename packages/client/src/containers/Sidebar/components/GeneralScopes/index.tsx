import React from 'react';
import { useRecoilValue } from 'recoil';

import { sidebarGeneralScopes } from '~/state/sidebar';

import GeneralScope from '~/containers/Sidebar/components/GeneralScope';

const GeneralScopes: React.FC = () => {
    const generalScopes = useRecoilValue(sidebarGeneralScopes);
    return (
        <>
            {generalScopes.map(scope => (
                <GeneralScope {...scope} key={scope.id} />
            ))}
        </>
    );
};

export default GeneralScopes;
