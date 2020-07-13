const stateKey = (type: 'atom' | 'selector', name: string): string =>
  `${type.toUpperCase()}/${name}`;

export const atomKey = (name: string): string => stateKey('atom', name);
export const selectorKey = (name: string): string => stateKey('selector', name);
