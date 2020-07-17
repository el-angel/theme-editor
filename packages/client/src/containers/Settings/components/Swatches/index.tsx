import React from 'react';

import getSwatches from '~/helpers/swatches';

import css from './styles.module.scss';

interface Props {
    color: string;
    onColorSelect: (hex: string) => void;
}

const Swatches: React.FC<Props> = ({ color, onColorSelect }) => {
    const [swatches, setSwatches] = React.useState<string[][]>([]);

    React.useEffect(() => {
        setSwatches(getSwatches(color));
    }, [color]);

    return (
        <div className={css.container}>
            {swatches.map((group, i) => (
                <div className={css.swatchGroup} key={`group-${i}`}>
                    {group.map((color, j) => (
                        <div
                            key={`${i}-${j}`}
                            className={css.swatch}
                            onClick={(): void => onColorSelect(color)}
                            style={{ backgroundColor: color }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Swatches;
