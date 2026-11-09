import {Position} from '../YMapDrawerControl/YMapDrawerControl';

/**
 * Converts a numeric or string value into a string suitable for CSS properties.
 * If a number is provided, it appends "px" to the value.
 * If a string is provided, it is returned unchanged.
 *
 * @param {number | string} value - The value to convert. Can be a number or a string.
 * @returns {string} A string formatted for use in CSS.
 *
 * @example
 * toCssProp(10); // "10px"
 * toCssProp('50%'); // "50%"
 */
export function toCssProp(value: string | number): string {
    if (typeof value === 'number') {
        return `${value}px`;
    }
    return value;
}

export function getSizeCssValue(options: {
    originalValue?: number | string;
    currentPosition: Position;
    ignorePositions: Position[];
    ignorePositionValue: string;
    defaultValue: string;
}): string {
    if (options.ignorePositions.includes(options.currentPosition)) {
        return options.ignorePositionValue;
    }
    if (options.originalValue === undefined) {
        return options.defaultValue;
    }
    return toCssProp(options.originalValue);
}
