
import React, { useState, useMemo } from 'react';
import { TitleAnalysisResult } from '../types';
import { TokenDisplay } from './TokenDisplay';
import { KeywordTable, KeywordTableHeader } from './KeywordTable';
import { formatPopularity } from '../utils';
import { Copy, Check, Tag } from 'lucide-react';

interface Props {
  result: TitleAnalysisResult;
  label?: string; // Optional custom label (e.g. "新品期")
  index?: number; // Optional index for numbering if no specific label
}

export const TitleCard: React.FC<Props> = ({ result, label, index }) => {
  const [copied, setCopied] = useState(false);
  const [activeTokens, setActiveTokens] = useState<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTokenClick = (token: string) => {
    setActiveTokens(prev => {
        if (prev.includes(token)) {
            return prev.filter(t => t !== token);
        } else {
            return [...prev, token];
        }
    });
  };

  // Calculate filtered count to match what the table displays
  const filteredKeywordsCount = useMemo(() => {
    if (activeTokens.length === 0) {
        return result.matchedKeywords.length;
    }
    return result.matchedKeywords.filter(kw => 
        activeTokens.some(token => kw.keyword.includes(token))
    ).length;
  }, [result.matchedKeywords, activeTokens]);

  const displayLabel = label || (index !== undefined ? `推荐方案 #${index + 1}` : '标题分析');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 transition-all relative">
      {/* Sticky Header Section */}
      <div className="sticky top-16 z-20 bg-white border-b border-slate-100 rounded-t-xl shadow-sm">
        {/* Title Information */}
        <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 px-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-sm shadow-indigo-200">
                    {displayLabel}
                </div>
                {result.tag && result.group === 'other' && (
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                    <Tag size={12} />
                    {result.tag}
                  </div>
                )}
                <div className="hidden md:block w-px h-6 bg-slate-200 mx-1"></div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">标题数据分析</h3>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-green-100 shadow-sm">
                覆盖人气: {formatPopularity(result.totalPopularityMin)} ~ {formatPopularity(result.totalPopularityMax)}
                </div>
                <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 shadow-sm">
                    命中词数: {filteredKeywordsCount}
                </div>
            </div>
            </div>

            <div className="relative group mb-6">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-xl text-slate-800 font-medium tracking-wide break-all pr-12 leading-relaxed shadow-inner">
                {result.title}
                </div>
                <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm hover:shadow"
                    title="复制标题"
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>

            <div>
              <TokenDisplay 
                tokens={result.tokens} 
                activeTokens={activeTokens}
                onTokenClick={handleTokenClick}
              />
            </div>
        </div>

        {/* Sticky Table Header */}
        <div className="border-t border-slate-200 bg-slate-100 px-6 pt-0 pb-0">
             <div className="overflow-hidden"> 
                <KeywordTableHeader />
             </div>
        </div>
      </div>

      {/* Matched Keywords Table - Body Only */}
      <div className="px-6 pb-6 pt-0">
         <KeywordTable 
            keywords={result.matchedKeywords} 
            titleContext={result.title} 
            hideHeader={true} 
            highlightTokens={activeTokens}
         />
      </div>
    </div>
  );
};
