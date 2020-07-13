import { CSS } from '~/types';

const stringifyCss = (obj: CSS): string => {
  const css = Object.keys(obj).reduce((acc: string, className: string) => {
    const props = obj[className];

    acc += `.${className} {\n`;

    Object.keys(props).map(property => {
      const cssProperty = property.replace(/[A-Z]/g, m => '-' + m.toLowerCase());

      acc += `${cssProperty}: ${props[property]};\n`;
    });

    acc += `}\n`;
    acc += '\n';

    return acc;
  }, '');

  return css;
};

export default stringifyCss;
