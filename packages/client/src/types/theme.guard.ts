import { Theme } from './theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTheme = (obj: any): obj is Theme => {
  return (
    typeof obj?.colors === 'object' &&
    Array.isArray(obj.tokenColors) &&
    obj.tokenColors.every(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((Array.isArray(e.scope) && e.scope.every((e: any) => typeof e === 'string')) ||
          typeof e.scope === 'string') &&
        typeof e.settings === 'object' &&
        (typeof e.settings.fontStyle === 'undefined' || typeof e.settings.fontStyle === 'string') &&
        typeof e.settings.foreground === 'string',
    )
  );
};

export default isTheme;
