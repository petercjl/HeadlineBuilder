import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Send, X, AlertCircle } from 'lucide-react';
import { TitleBuilderInput } from '../types';

interface Props {
  onSubmit: (data: TitleBuilderInput) => void;
  isExpanded?: boolean;
}

export const InputForm: React.FC<Props> = ({ onSubmit, isExpanded = true }) => {
  const [file, setFile] = useState<File | null>(null);
  const [coreKeywords, setCoreKeywords] = useState('');
  const [sellingPoints, setSellingPoints] = useState('');
  const [brandName, setBrandName] = useState('');
  const [errors, setErrors] = useState<{file?: string, keywords?: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors(prev => ({ ...prev, file: undefined }));
    }
  };

  const handleSubmit = () => {
    const newErrors: {file?: string, keywords?: string} = {};
    if (!file) newErrors.file = "请上传文件";
    if (!coreKeywords.trim()) newErrors.keywords = "请输入核心词";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      file,
      coreKeywords,
      sellingPoints,
      brandName
    });
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 shadow-xl">
      <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Chat Input Header */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">标题制作智能体 - 参数配置</span>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: File */}
            <div className="md:col-span-2">
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 flex items-center justify-center gap-4 cursor-pointer transition-colors
                        ${errors.file ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
                        ${file ? 'bg-indigo-50 border-indigo-200' : ''}
                    `}
                 >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xls,.csv" />
                    {file ? (
                         <div className="flex items-center gap-3 text-indigo-700">
                            <FileSpreadsheet size={24} />
                            <div className="text-sm font-medium truncate max-w-[200px]">{file.name}</div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="p-1 hover:bg-white rounded-full"
                            >
                                <X size={14} />
                            </button>
                         </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                            <Upload size={20} />
                            <span className="text-sm">上传搜索词表格 (Excel)</span>
                        </div>
                    )}
                 </div>
                 {errors.file && <div className="text-xs text-red-500 mt-1 ml-1">{errors.file}</div>}
            </div>

            {/* Right Column: Inputs */}
            <div className="space-y-3 md:col-span-2">
                <div>
                    <input 
                        type="text" 
                        value={coreKeywords}
                        onChange={(e) => setCoreKeywords(e.target.value)}
                        placeholder="* 商品核心词 (例如: 厨房剪刀)"
                        className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-all
                            ${errors.keywords ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'}
                        `}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <input 
                        type="text" 
                        value={sellingPoints}
                        onChange={(e) => setSellingPoints(e.target.value)}
                        placeholder="卖点词 (逗号分隔)"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                    <input 
                        type="text" 
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        placeholder="自有品牌 (选填)"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="text-xs text-slate-400">
                AI将分析上传的表格并生成多维度标题
            </div>
            <button 
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-indigo-200"
            >
                <Send size={16} />
                发送并生成
            </button>
        </div>
      </div>
    </div>
  );
};