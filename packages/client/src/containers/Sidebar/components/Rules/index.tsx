import React from 'react';
import { useRecoilValue } from 'recoil';

import { sidebarRules } from '~/state/sidebar';

import Rule from '~/containers/Sidebar/components/Rule';

const Rules: React.FC = () => {
    const rules = useRecoilValue(sidebarRules);

    return (
        <>
            {rules.map(rule => (
                <Rule key={rule.id} {...rule} />
            ))}
        </>
    );
};

export default Rules;
