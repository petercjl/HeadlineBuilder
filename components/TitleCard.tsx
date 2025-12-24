import React, { useState } from 'react';
import { TitleAnalysisResult } from '../types';
import { TokenDisplay } from './TokenDisplay';
import { KeywordTable, KeywordTableHeader } from './KeywordTable';
import { formatPopularity } from '../utils';
import { Copy, Check } from 'lucide-react';

interface Props {
  result: TitleAnalysisResult;
  index: number;
}

export const TitleCard: React.FC<Props> = ({ result, index }) => {
  const [copied, setCopied] = useState(false);
  const [activeToken, setActiveToken] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTokenClick = (token: string) => {
    // Toggle: if clicking same token, deselect it
    setActiveToken(prev => prev === token ? null : token);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 transition-all relative">
      {/* Sticky Header Section */}
      <div className="sticky top-16 z-20 bg-white border-b border-slate-100 rounded-t-xl shadow-sm">
        {/* Title Information */}
        <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-sm shadow-indigo-200">
                    {index + 1}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">推荐方案 #{index + 1}</h3>
                    <p className="text-sm text-slate-500">高点击高转化组合</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-green-100 shadow-sm">
                覆盖人气: {formatPopularity(result.totalPopularityMin)} ~ {formatPopularity(result.totalPopularityMax)}
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
                activeToken={activeToken}
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
            highlightToken={activeToken}
         />
      </div>
    </div>
  );
};