import { SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP } from '~/constants';

const getSemanticTokenFallback = (token: string): string => {
    if (SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[token]) {
        return SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[token];
    }

    const [type, ...modifiers] = token.split('.');

    let i = 0;
    while (i < modifiers.length) {
        const _token = `${type}.${modifiers[i]}`;
        console.log('inner token', _token);
        if (SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[_token]) {
            return SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[_token];
        }
        i++;
    }

    if (SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[type]) {
        return SEMANTIC_HIGHLIGHTING_TEXTMATE_MAP[type];
    }

    throw new Error(`${token} has no fallback. Weird.`);
};

export default getSemanticTokenFallback;
