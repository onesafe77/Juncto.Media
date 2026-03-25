import React from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
  variant?: 'featured' | 'grid' | 'thumb';
  category?: 'kebijakan' | 'anggaran' | 'hukum' | 'keadilan';
  className?: string;
}

const ImagePlaceholder = ({ category }: { category?: string }) => {
  const colors: Record<string, { bg: string; icon: string; text: string }> = {
    kebijakan: { bg: '#E8EFF9', icon: '📋', text: '#003087' },
    anggaran: { bg: '#E8F5EE', icon: '📊', text: '#1A8C5B' },
    hukum: { bg: '#FFEBEB', icon: '⚖️', text: '#C41A1A' },
    keadilan: { bg: '#F3E5F5', icon: '🤝', text: '#4A148C' },
  };
  const c = category && colors[category] ? colors[category] : { bg: '#F4F6FA', icon: '📰', text: '#8899AA' };

  return (
    <div
      className="w-full h-full flex items-center justify-center text-2xl"
      style={{ background: c.bg }}
    >
      {c.icon}
    </div>
  );
};

export default function ArticleImage({ src, alt, variant = 'thumb', category, className }: ArticleImageProps) {
  const variants = {
    featured: 'w-full aspect-video lg:w-[38%] lg:aspect-auto lg:min-h-[240px] flex-shrink-0',
    grid: 'w-full aspect-video',
    thumb: 'w-20 h-20 sm:w-[100px] sm:h-[75px] lg:w-[120px] lg:h-[90px] flex-shrink-0',
  };

  const [hasError, setHasError] = React.useState(false);

  return (
    <div className={`overflow-hidden ${variant === 'thumb' ? 'rounded-lg' : 'rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none'} ${className || variants[variant]}`}>
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center block transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        <ImagePlaceholder category={category} />
      )}
    </div>
  );
}
