export const WORKING_FILENAME = 'semanticHighlightParser';

export const TOKEN_TYPE_WILDCARD = '*';
export const TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR = ':';
export const CLASSIFIER_MODIFIER_SEPARATOR = '.';

export const ID_PATTERN = '\\w+[-_\\w+]*';
export const TYPE_MOD_ID_PATTERN = `^${ID_PATTERN}$`;

export const SELECTOR_PATTERN = `^(${ID_PATTERN}|\\*)(\\${CLASSIFIER_MODIFIER_SEPARATOR}${ID_PATTERN})*(\\${TOKEN_CLASSIFIER_LANGUAGE_SEPARATOR}${ID_PATTERN})?$`;
