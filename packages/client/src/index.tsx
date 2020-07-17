import React, { Profiler } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ReactDOM from 'react-dom';
import { unstable_trace as trace } from 'scheduler/tracing';

import App from './App';

import './index.css';

ReactDOM.render(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Profiler id="Application" onRender={(): void => {}}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Profiler>,
    document.getElementById('root'),
);
