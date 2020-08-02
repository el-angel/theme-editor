import React from 'react';
import { useRecoilValue } from 'recoil';

import { sidebarSemanticTokens } from '~/state/sidebar';

import SemanticToken from '~/containers/Sidebar/components/SemanticToken';

const SemanticTokens: React.FC = () => {
    const semanticTokens = useRecoilValue(sidebarSemanticTokens);

    return (
        <>
            {semanticTokens.map(token => (
                <SemanticToken key={token.id} {...token} />
            ))}
        </>
    );
};

export default SemanticTokens;
