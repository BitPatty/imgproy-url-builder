import { stringifyOptions } from '../common';

/**
 * If true, imgproxy will enlarge the image if it is smaller than the given size.
 *
 * @see {@link https://github.com/imgproxy/imgproxy/blob/6f292443eafb2e39f9252175b61faa6b38105a7c/docs/generating_the_url.md#enlarge}. for the imgproxy documentation
 *
 * @returns  The enlarge param string
 */
const enlarge = (): string => stringifyOptions('el', [true]);

export default enlarge;
