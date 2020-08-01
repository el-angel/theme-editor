const stateKey = (type: 'atom' | 'selector', scope: string, name: string): string =>
    `${type.toUpperCase()}/${scope}/${name}`;

export const atomKey = (scope: string, name: string): string => stateKey('atom', scope, name);
export const selectorKey = (scope: string, name: string): string =>
    stateKey('selector', scope, name);
