type calculateTranslateFn = (position: number, width: number) => number;

export const calculateTranslate: calculateTranslateFn = (position, width) => {
    return position * width * (-1);
}

type getCurrentPositionFn = ({control, position, total}: {control: string; position: number; total: number;}) => number;

export const getCurrentPosition: getCurrentPositionFn = ({control, position, total}) => {
    const lastPosition: Boolean = position === total - 1;
    const firstPosition: Boolean = position === 0;

    if (control === 'next') {
        return lastPosition ? 0 : position + 1;
    }

    return firstPosition ? total - 1 : position - 1;
}