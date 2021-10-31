import autoRotate from './transformers/auto-rotate';
import background, { BackgroundOptions } from './transformers/background';
import blur, { BlurOptions } from './transformers/blur';
import crop, { CropOptions } from './transformers/crop';
import dpr, { DprOptions } from './transformers/dpr';
import fileName, { FileNameOptions } from './transformers/filename';
import format, { FormatOptions } from './transformers/format';
import gravity, { GravityOptions } from './transformers/gravity';
import maxBytes, { MaxBytesOptions } from './transformers/max-bytes';
import pad, { PaddingOptions } from './transformers/pad';
import preset, { PresetOptions } from './transformers/preset';
import quality, { QualityOptions } from './transformers/quality';
import resize, { ResizeOptions } from './transformers/resize';
import rotate, { RotationOptions } from './transformers/rotate';
import sharpen, { SharpenOptions } from './transformers/sharpen';
import stripColorProfile from './transformers/strip-color-profile';
import stripMetadata from './transformers/strip-metadata';
import trim, { TrimOptions } from './transformers/trim';
import watermark, { WatermarkOptions } from './transformers/watermark';

import cacheBuster, { CacheBusterOptions } from './transformers/cache-buster';
import { encodeFilePath, generateSignature } from './utils';

type ForwardType = Partial<ParamBuilder> & {
  readonly modifiers: string[];
};

class ParamBuilder {
  public readonly modifiers: string[];

  public constructor(initialModifiers: string[] = []) {
    this.modifiers = initialModifiers;
  }

  /**
   * Creates a new param builder instance with the
   * current modifiers
   *
   * @returns A copy of this param builder
   */
  public clone<T extends ForwardType>(this: T): T {
    return new ParamBuilder([...this.modifiers]) as T;
  }

  /**
   * Builds the imgproxy URL
   *
   * @param options The URL options
   *
   * @returns The imgproxy URL
   */
  public build(options?: {
    path: string;
    baseUrl?: string;
    plain?: boolean;
    signature?: { key: string; salt: string };
  }): string {
    const { baseUrl, path, plain, signature } = options ?? {};
    if (!path) return this.modifiers.join('/');
    const mods = [...this.modifiers];

    if (path && plain) mods.push('plain', path);
    else mods.push(encodeFilePath(path));

    const res = mods.join('/');
    const finalPath = signature
      ? `${generateSignature(res, signature.key, signature.salt)}/${res}`
      : res;

    return baseUrl ? `${baseUrl}/${finalPath}` : `/${finalPath}`;
  }

  /**
   * Automatically rotates the image based on
   * the EXIF orientation parameter
   */
  public autoRotate<T extends ForwardType>(this: T): Omit<T, 'autoRotate'> {
    this.modifiers.push(autoRotate());
    return this;
  }

  /**
   * Fills the image background with the specified color
   *
   * @param options The background color (hex encoded string or RGB object)
   */
  public background<T extends ForwardType>(
    this: T,
    options: BackgroundOptions,
  ): Omit<T, 'background'> {
    this.modifiers.push(background(options));
    return this;
  }

  /**
   * Applies a gaussian blur filter to the image
   *
   * @param sigma The size of the blur mask
   */
  public blur<T extends ForwardType>(
    this: T,
    options: BlurOptions,
  ): Omit<T, 'blur'> {
    this.modifiers.push(blur(options));
    return this;
  }

  /**
   * Adds a cache buster to the imgproxy params
   */
  public cacheBuster<T extends ForwardType>(
    this: T,
    options: CacheBusterOptions,
  ): Omit<T, 'cacheBuster'> {
    this.modifiers.push(cacheBuster(options));
    return this;
  }

  /**
   * Crops the image
   *
   * @param options The cropping options
   */
  public crop<T extends ForwardType>(
    this: T,
    options: CropOptions,
  ): Omit<T, 'crop'> {
    this.modifiers.push(crop(options));
    return this;
  }

  /**
   * Multiplies the dimensions according to the specified factor
   *
   * @param options the Dpr factor (must be greater than 0)
   */
  public dpr<T extends ForwardType>(
    this: T,
    options: DprOptions,
  ): Omit<T, 'dpr'> {
    this.modifiers.push(dpr(options));
    return this;
  }

  /**
   * Sets the filename for the Content-Disposition header
   *
   * @param options The filename
   */
  public filename<T extends ForwardType>(
    this: T,
    options: FileNameOptions,
  ): Omit<T, 'dpr'> {
    this.modifiers.push(fileName(options));
    return this;
  }

  /**
   * Specifies the resulting image format
   *
   * @param options The target format
   */
  public format<T extends ForwardType>(
    this: T,
    options: FormatOptions,
  ): Omit<T, 'format'> {
    this.modifiers.push(format(options));
    return this;
  }

  /**
   * Sets the gravity
   *
   * @param options The gravity options
   */
  public gravity<T extends ForwardType>(
    this: T,
    options: GravityOptions,
  ): Omit<T, 'gravity'> {
    this.modifiers.push(gravity(options));
    return this;
  }

  /**
   * Limits the file size to the specified
   * Specifies the resulting image format
   *
   * Note: only applicable to jpg, webp, heic and tiff
   *
   * @param options The number of bytes
   */
  public maxBytes<T extends ForwardType>(
    this: T,
    options: MaxBytesOptions,
  ): Omit<T, 'maxBytes'> {
    this.modifiers.push(maxBytes(options));
    return this;
  }

  /**
   * Applies the specified padding to the image
   *
   * @param options The padding options
   */
  public pad<T extends ForwardType>(
    this: T,
    options: PaddingOptions,
  ): Omit<T, 'pad'> {
    this.modifiers.push(pad(options));
    return this;
  }

  /**
   * Sets one or many presets to be used by the imgproxy
   *
   * @param options The presets
   */
  public preset<T extends ForwardType>(
    this: T,
    options: PresetOptions,
  ): Omit<T, 'preset'> {
    this.modifiers.push(preset(options));
    return this;
  }

  /**
   * Redefines the quality of the resulting image
   *
   * @param options The quality in percentage (between 0 and 1)
   */
  public quality<T extends ForwardType>(
    this: T,
    options: QualityOptions,
  ): Omit<T, 'quality'> {
    this.modifiers.push(quality(options));
    return this;
  }

  /**
   * Resizes the image
   *
   * @param options The resizing options
   */
  public resize<T extends ForwardType>(
    this: T,
    options: ResizeOptions,
  ): Omit<T, 'resize'> {
    this.modifiers.push(resize(options));
    return this;
  }

  /**
   * Rotates the image by the specified angle
   *
   * @param options The angle
   */
  public rotate<T extends ForwardType>(
    this: T,
    options: RotationOptions,
  ): Omit<T, 'rotate'> {
    this.modifiers.push(rotate(options));
    return this;
  }

  /**
   * Applies a sharpen filter to the image
   *
   * @param sigma The size of the sharpen mask
   */
  public sharpen<T extends ForwardType>(
    this: T,
    options: SharpenOptions,
  ): Omit<T, 'sharpen'> {
    this.modifiers.push(sharpen(options));
    return this;
  }

  /**
   * Strips the color profile from teh image
   */
  public stripColorProfile<T extends ForwardType>(
    this: T,
  ): Omit<T, 'stripColorProfile'> {
    this.modifiers.push(stripColorProfile());
    return this;
  }

  /**
   * Strips the metadata from teh image
   */
  public stripMetadata<T extends ForwardType>(
    this: T,
  ): Omit<T, 'stripMetadata'> {
    this.modifiers.push(stripMetadata());
    return this;
  }

  /**
   * Trims the image background
   *
   * @param options The trimming options
   */
  public trim<T extends ForwardType>(
    this: T,
    options: TrimOptions,
  ): Omit<T, 'trim'> {
    this.modifiers.push(trim(options));
    return this;
  }

  /**
   * Applies a gaussian blur filter to the image
   *
   * @param options The size of the blur mask
   */
  public watermark<T extends ForwardType>(
    this: T,
    options: WatermarkOptions,
  ): Omit<T, 'watermark'> {
    this.modifiers.push(watermark(options));
    return this;
  }
}

const pb = (): ParamBuilder => new ParamBuilder();

export default pb;
export { ParamBuilder };
