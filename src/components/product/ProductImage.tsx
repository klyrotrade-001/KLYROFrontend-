'use client';

import Image, { ImageProps } from 'next/image';

/**
 * Drop-in replacement for next/image that automatically sets
 * unoptimized=true for Base64 data URLs (stored in MongoDB).
 * External URLs (Unsplash, Cloudinary, etc.) go through normal optimization.
 */
type ProductImageProps = Omit<ImageProps, 'unoptimized'>;

export default function ProductImage({ src, ...props }: ProductImageProps) {
  const isBase64 =
    typeof src === 'string' && src.startsWith('data:');

  return <Image src={src} unoptimized={isBase64} {...props} />;
}
