
import React, { useMemo } from 'react';
import { KeywordData } from '../types';

interface Props {
  keywords: KeywordData[];
  titleContext?: string;
  hideHeader?: boolean;
  highlightTokens?: string[];
}

// Helper to highlight tokens within a keyword string
const KeywordHighlighter = ({ text, highlights }: { text: string, highlights?: string[] }) => {
  if (!highlights || highlights.length === 0) {
    return <span className="text-blue-600 truncate">{text}</span>;
  }
  
  // Escape regex characters
  const safeHighlights = highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Remove duplicates and empty strings
  const uniqueHighlights = [...new Set(safeHighlights)].filter(Boolean);
  
  if (uniqueHighlights.length === 0) return <span className="text-blue-600 truncate">{text}</span>;

  // Create regex pattern to match any of the highlights
  const pattern = new RegExp(`(${uniqueHighlights.join('|')})`, 'g');
  
  const parts = text.split(pattern);
  
  return (
    <span className="text-blue-600 truncate" title={text}>
      {parts.map((part, i) => {
        // Check if this part matches one of our highlights
        const isMatch = highlights.some(h => h === part);
        return (
            <React.Fragment key={i}>
            {isMatch ? (
                <span className="bg-orange-300 text-slate-900 font-bold px-0.5 rounded-sm shadow-sm">
                {part}
                </span>
            ) : part}
            </React.Fragment>
        );
      })}
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

export const KeywordTable: React.FC<Props> = ({ keywords, titleContext = "", hideHeader = false, highlightTokens = [] }) => {
  
  // Filter keywords based on selected tokens
  const filteredKeywords = useMemo(() => {
    if (!highlightTokens || highlightTokens.length === 0) {
      return keywords;
    }
    return keywords.filter(kw => highlightTokens.some(token => kw.keyword.includes(token)));
  }, [keywords, highlightTokens]);

  if (keywords.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
        该标题未命中核心搜索词数据库
      </div>
    );
  }

  if (filteredKeywords.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500 font-medium">没有找到包含选中词根的搜索词</p>
        <p className="text-slate-400 text-sm mt-1">请尝试选择其他词根或取消筛选</p>
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
          {filteredKeywords.map((kw, index) => {
             return (
                <div 
                key={kw.id} 
                className={`flex items-center border-b border-slate-100 hover:bg-slate-50 transition-colors 
                    ${index === filteredKeywords.length - 1 ? 'border-b-0' : ''}
                    ${highlightTokens.length > 0 ? 'bg-orange-50/20' : ''}
                `}
                >
                <div className="w-16 px-4 py-3 shrink-0 text-slate-900 font-medium text-center">{kw.rank}</div>
                <div className="w-32 px-4 py-3 shrink-0 font-medium">
                    <KeywordHighlighter text={kw.keyword} highlights={highlightTokens} />
                </div>
                <div className="flex-1 px-4 py-3 min-w-[200px] border-l border-r border-slate-50">
                    <TitleMatchPreview title={titleContext} keyword={kw.keyword} />
                </div>
                <div className="w-32 px-4 py-3 shrink-0 text-slate-600 text-sm">{kw.popularityRaw}</div>
                <div className="w-24 px-4 py-3 shrink-0 text-slate-600 text-sm text-center">{kw.clickRate}</div>
                <div className="w-28 px-4 py-3 shrink-0 text-slate-600 text-sm text-center">{kw.conversionRate}</div>
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};
