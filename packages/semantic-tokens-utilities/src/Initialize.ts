import { registerTokenFallback } from './FallbackScopes';
import { FallbackRegister } from './types/index';

const initialize = (cb: (register: FallbackRegister) => void): void => {
    cb(registerTokenFallback);
};

export default initialize;
