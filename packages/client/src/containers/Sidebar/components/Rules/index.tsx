import React from 'react';
import { useRecoilValue } from 'recoil';

import { getAllRules } from '~/state/rules';

import Rule from '~/containers/Sidebar/components/Rule';

const Rules: React.FC = () => {
    const rules = useRecoilValue(getAllRules);

    return (
        <>
            {rules.map(rule => (
                <Rule key={rule.id} {...rule} />
            ))}
        </>
    );
};

export default Rules;
