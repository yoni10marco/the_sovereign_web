"use client";

import { useState } from "react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  
}

/**
 * Renders an <img> and hides it (zero size, no broken icon) if it fails to load.
 */
export function SafeImage({ src, alt, className, style, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
