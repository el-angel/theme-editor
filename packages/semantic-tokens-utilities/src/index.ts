import createToken from './CreateToken';
import createTokenString from './CreateTokenString';
import parser, { SemanticTokensParserResult } from './Parser';
import * as matcher from './Matcher';
import { SemanticToken, Token } from './types';
import * as Presets from './FallbackPresets';
import initialize from './Initialize';

export { initialize };
export { Presets };
export { createToken };
export { createTokenString };
export { parser };
export { matcher };

// types
export { SemanticToken, Token };
export { SemanticTokensParserResult };
