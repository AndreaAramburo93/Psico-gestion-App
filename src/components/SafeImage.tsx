import React, { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  fallbackIcon?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  fallbackIcon = 'person',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-primary-fixed text-primary font-title-md font-bold select-none ${className}`}
        aria-label={alt}
      >
        {fallbackText ? (
          <span>{fallbackText}</span>
        ) : (
          <span className="material-symbols-outlined text-[24px]">{fallbackIcon}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
