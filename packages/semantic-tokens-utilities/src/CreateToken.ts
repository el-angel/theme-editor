import {
    SELECTOR_PATTERN,
    CLASSIFIER_MODIFIER_SEPARATOR,
    TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR,
} from './constants';
import { Token } from './types';

const createToken = (queryString: string): Token => {
    if (!queryString.match(SELECTOR_PATTERN)) {
        throw new Error(`${queryString} is not a valid selector.`);
    }

    let i = queryString.length,
        j = queryString.length,
        language: string | undefined;

    const modifiers: string[] = [];

    for (; i >= 0; i--) {
        const char = queryString[i];
        if (
            char === CLASSIFIER_MODIFIER_SEPARATOR ||
            char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR
        ) {
            const segment = queryString.substring(i + 1, j);

            j = i;

            if (char === TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR) {
                language = segment;
            } else {
                modifiers.push(segment);
            }
        }
    }

    const type = queryString.substring(0, j);

    return {
        type,
        modifiers: modifiers.reverse(),
        language,
    };
};

export default createToken;
