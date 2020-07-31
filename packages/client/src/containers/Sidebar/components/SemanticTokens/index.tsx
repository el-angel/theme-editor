import React from 'react';
import { useRecoilValue } from 'recoil';

import { semanticTokensState } from '~/state/semanticTokens';

import SemanticToken from '~/containers/Sidebar/components/SemanticToken';

const SemanticTokens: React.FC = () => {
    const semanticTokens = useRecoilValue(semanticTokensState);

    return (
        <>
            {semanticTokens.map(token => (
                <SemanticToken key={token.id} {...token} />
            ))}
        </>
    );
};

export default SemanticTokens;
