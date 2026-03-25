"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Renders an <img> with a placeholder if the image fails to load.
 */
export function SafeImage({ src, alt, className, style, ...props }: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={style}
        aria-label={alt}
        role="img"
      >
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30"
          style={{ minHeight: "4rem", backgroundColor: "var(--morph-secondary, #e5e7eb)" }}>
          <ImageOff size={24} />
        </div>
      </div>
    );
  }

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
