import React from 'react';
import { useRecoilValue } from 'recoil';

import { getSemanticTokens } from '~/state/semanticTokens';

import SemanticToken from '~/containers/Sidebar/components/SemanticToken';

const SemanticTokens: React.FC = () => {
    const semanticTokens = useRecoilValue(getSemanticTokens);

    return (
        <>
            {semanticTokens.map(token => (
                <SemanticToken key={token.id} {...token} />
            ))}
        </>
    );
};

export default SemanticTokens;
