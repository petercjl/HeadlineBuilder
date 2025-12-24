import React, { useEffect, useRef } from 'react';
import { KeywordData } from '../types';

interface Props {
  keywords: KeywordData[];
  titleContext?: string;
  hideHeader?: boolean;
  highlightToken?: string | null;
}

// Helper to highlight token within a keyword string
const KeywordHighlighter = ({ text, highlight }: { text: string, highlight?: string | null }) => {
  if (!highlight || !text.includes(highlight)) {
    return <span className="text-blue-600 truncate">{text}</span>;
  }
  
  const parts = text.split(highlight);
  return (
    <span className="text-blue-600 truncate" title={text}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="bg-orange-300 text-slate-900 font-bold px-0.5 rounded-sm shadow-sm">
              {highlight}
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

const TitleMatchPreview = ({ title, keyword }: { title: string, keyword: string }) => {
  if (!title) return <span className="text-slate-300">-</span>;
  
  // Simple split-join to highlight all occurrences of the keyword
  const parts = title.split(keyword);
  // If keyword not found (shouldn't happen in matched data), just return title
  if (parts.length === 1) return <span className="text-slate-400 truncate">{title}</span>;

  return (
    <div className="text-xs text-slate-400 truncate leading-relaxed" title={title}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="bg-yellow-200 text-slate-900 font-bold px-0.5 mx-0.5 rounded-sm shadow-sm border border-yellow-300">
              {keyword}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export const KeywordTableHeader: React.FC = () => (
  <div className="flex items-center bg-slate-100 border-b border-slate-200 text-xs text-slate-500 uppercase font-medium">
    <div className="w-16 px-4 py-3 shrink-0 text-center">排名</div>
    <div className="w-32 px-4 py-3 shrink-0">搜索词</div>
    <div className="flex-1 px-4 py-3 min-w-[200px]">标题匹配预览</div>
    <div className="w-32 px-4 py-3 shrink-0">搜索人气</div>
    <div className="w-24 px-4 py-3 shrink-0 text-center">点击率</div>
    <div className="w-28 px-4 py-3 shrink-0 text-center">转化率</div>
  </div>
);

export const KeywordTable: React.FC<Props> = ({ keywords, titleContext = "", hideHeader = false, highlightToken }) => {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll logic
  useEffect(() => {
    if (highlightToken) {
      // Find index of first keyword containing the token
      const idx = keywords.findIndex(k => k.keyword.includes(highlightToken));
      if (idx !== -1 && rowRefs.current[idx]) {
        rowRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightToken, keywords]);

  if (keywords.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        该标题未命中核心搜索词数据库
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm bg-white">
      <div className="min-w-[800px]">
        {/* Optional Header (can be hidden if parent handles sticky header) */}
        {!hideHeader && <KeywordTableHeader />}
        
        {/* Body */}
        <div>
          {keywords.map((kw, index) => (
            <div 
              key={kw.id} 
              ref={el => rowRefs.current[index] = el}
              className={`flex items-center border-b border-slate-100 hover:bg-slate-50 transition-colors 
                ${index === keywords.length - 1 ? 'border-b-0' : ''}
                ${highlightToken && kw.keyword.includes(highlightToken) ? 'bg-orange-50/50 hover:bg-orange-50' : ''}
              `}
            >
              <div className="w-16 px-4 py-3 shrink-0 text-slate-900 font-medium text-center">{kw.rank}</div>
              <div className="w-32 px-4 py-3 shrink-0 font-medium">
                <KeywordHighlighter text={kw.keyword} highlight={highlightToken} />
              </div>
              <div className="flex-1 px-4 py-3 min-w-[200px] border-l border-r border-slate-50">
                <TitleMatchPreview title={titleContext} keyword={kw.keyword} />
              </div>
              <div className="w-32 px-4 py-3 shrink-0 text-slate-600 text-sm">{kw.popularityRaw}</div>
              <div className="w-24 px-4 py-3 shrink-0 text-slate-600 text-sm text-center">{kw.clickRate}</div>
              <div className="w-28 px-4 py-3 shrink-0 text-slate-600 text-sm text-center">{kw.conversionRate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};