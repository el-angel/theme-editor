import React from 'react';

import Editor from '~/containers/Code/components/Editor';

const Code: React.FC = () => {
    return (
        <>
            <React.Suspense fallback={<div>waiting for code</div>}>
                <Editor />
            </React.Suspense>
        </>
    );
};

export default Code;
