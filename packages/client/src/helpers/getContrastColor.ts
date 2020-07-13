import chroma from 'chroma-js';

const getContrastColor = (color: string): '#000000' | '#ffffff' => {
  return chroma.contrast(color || 'white', 'black') > 4.5 ? '#000000' : '#ffffff';
};

export default getContrastColor;
