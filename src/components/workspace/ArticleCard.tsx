import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, BarChart2, Scale, Users } from 'lucide-react';
import ArticleImage from './ArticleImage';

interface ArticleCardProps {
  rubrik: 'kebijakan' | 'anggaran' | 'hukum' | 'keadilan';
  title: string;
  snippet: string;
  tags: string[];
  author: string;
  time: string;
  readTime?: string;
  imageUrl: string;
  isFeatured?: boolean;
  breaking?: boolean;
  impactStats?: React.ReactNode;
  timeline?: React.ReactNode;
  inlineChart?: React.ReactNode;
  id: string;
  key?: string | number;
}

export default function ArticleCard({
  rubrik,
  title,
  snippet,
  tags,
  author,
  time,
  readTime,
  imageUrl,
  isFeatured = false,
  breaking = false,
  impactStats,
  timeline,
  inlineChart,
  id
}: ArticleCardProps) {
  const rubrikConfig = {
    kebijakan: { color: '#003087', label: 'KEBIJAKAN', icon: <FileText className="w-3 h-3" /> },
    anggaran: { color: '#1B5E20', label: 'ANGGARAN', icon: <BarChart2 className="w-3 h-3" /> },
    hukum: { color: '#B71C1C', label: 'HUKUM', icon: <Scale className="w-3 h-3" /> },
    keadilan: { color: '#4A148C', label: 'KEADILAN', icon: <Users className="w-3 h-3" /> },
  };

  const config = rubrikConfig[rubrik];

  return (
    <Link
      to={`/workspace/article/${id}`}
      className={`bg-white rounded-2xl border border-blue-gray/30 overflow-hidden hover:shadow-lg transition-shadow group flex ${isFeatured ? 'flex-col lg:flex-row' : 'flex-row p-4 sm:p-6'} min-w-0 pointer-events-auto`}
      style={isFeatured ? { borderLeftWidth: '4px', borderLeftColor: config.color } : {}}
    >
      <div className={`${isFeatured ? 'w-full aspect-video lg:w-[38%] lg:aspect-auto lg:min-h-[240px]' : 'w-20 h-20 sm:w-24 sm:h-[75px] lg:w-32 lg:h-[90px] rounded-lg'} relative overflow-hidden shrink-0 block`}>
        <ArticleImage src={imageUrl} alt={title} variant={isFeatured ? 'featured' : 'thumb'} category={rubrik} className="w-full h-full" />
        {isFeatured && <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-dark/50 pointer-events-none"></div>}
      </div>

      <div className={`flex-1 min-w-0 ${isFeatured ? 'p-4 sm:p-6 lg:p-8' : 'pl-4 sm:pl-6'} flex flex-col justify-between relative`}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4">
            <span
              className="text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0"
              style={{ backgroundColor: config.color }}
            >
              {config.icon} {config.label}
            </span>
            {breaking && (
              <span className="bg-[#E31B23] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shrink-0">
                🔴 BREAKING
              </span>
            )}
          </div>

          <div className="block min-w-0">
            <h2 className={`${isFeatured ? 'text-xl sm:text-2xl lg:text-3xl mb-3' : 'text-sm sm:text-base lg:text-lg mb-1 sm:mb-2'} font-heading font-bold text-dark leading-tight group-hover:text-primary transition-colors truncate sm:whitespace-normal sm:line-clamp-2`}>
              {title}
            </h2>
          </div>

          <p className={`text-text-medium mb-4 ${isFeatured ? 'line-clamp-3' : 'hidden sm:line-clamp-1 lg:line-clamp-2 text-sm'}`}>
            {snippet}
          </p>

          {isFeatured && inlineChart && <div className="mb-4">{inlineChart}</div>}
          {isFeatured && timeline && <div className="mb-4">{timeline}</div>}
          {isFeatured && impactStats && <div className="mb-4">{impactStats}</div>}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags && tags.map(tag => (
              <span key={tag} className={`${isFeatured ? 'text-xs px-2 py-1' : 'text-[9px] px-1.5 py-0.5'} font-bold text-primary bg-primary/5 border border-primary/20 rounded-md uppercase tracking-tight`}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 ${isFeatured ? 'pt-4 border-t border-blue-gray/20' : 'mt-auto'}`}>
          <div className={`text-text-light font-medium truncate ${isFeatured ? 'text-sm' : 'text-xs sm:text-sm'}`}>
            {isFeatured ? `Oleh ${author} • ` : ''}{time} {readTime && `• ${readTime}`}
          </div>
          {isFeatured && (
            <div
              className="inline-flex items-center justify-center px-6 py-2.5 rounded transition-colors font-bold text-white text-sm shrink-0"
              style={{ backgroundColor: config.color }}
            >
              Baca Artikel &rarr;
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
