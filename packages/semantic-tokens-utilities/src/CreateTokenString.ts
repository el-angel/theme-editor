import { Token } from './types';

const createTokenString = ({ type, modifiers, language }: Token): string =>
    `${[type, ...[...modifiers].sort()].join('.')}${language !== undefined ? ':' + language : ''}`;

export default createTokenString;
