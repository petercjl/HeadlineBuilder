import React from 'react';

interface Props {
  tokens: string[];
  activeTokens?: string[];
  onTokenClick?: (token: string) => void;
}

export const TokenDisplay: React.FC<Props> = ({ tokens, activeTokens = [], onTokenClick }) => {
  return (
    <div className="flex flex-wrap gap-1.5 items-center bg-slate-50 p-3 rounded-md border border-slate-200">
      <span className="text-xs font-semibold text-slate-500 mr-2 uppercase tracking-wider">
        拆词结果:
      </span>
      {tokens.map((token, idx) => {
        const isActive = activeTokens?.includes(token);
        return (
          <React.Fragment key={idx}>
            <button
              onClick={() => onTokenClick && onTokenClick(token)}
              className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border transition-all cursor-pointer select-none
                ${isActive 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200' 
                  : 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 hover:border-blue-200'
                }
              `}
            >
              {token}
            </button>
            {idx < tokens.length - 1 && (
              <span className="text-slate-300 mx-0.5">|</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};