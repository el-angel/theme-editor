import chroma from 'chroma-js';

const getScale = (...colors: string[]): ReturnType<chroma.Scale['colors']> => {
    const scale = chroma.scale(colors).mode('lab').colors(12);
    return scale;
};

const getSwatches = (hex: string): ReturnType<typeof getScale>[] => {
    const lightToDark = getScale(chroma.mix('#ffffff', hex, 0.15).hex(), hex, '#000000');

    const redToCyan = getScale(
        chroma.mix('red', hex, 0.1).hex(),
        hex,
        chroma.mix('cyan', hex, 0.1).hex(),
    );
    const greenToMagenta = getScale(
        chroma.mix('green', hex, 0.2).hex(),
        hex,
        chroma.mix('magenta', hex, 0.1).hex(),
    );
    const blueToYellow = getScale(
        chroma.mix('blue', hex, 0.2).hex(),
        hex,
        chroma.mix('yellow', hex, 0.1).hex(),
    );

    return [lightToDark, redToCyan, greenToMagenta, blueToYellow];
};

export default getSwatches;
