import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, ArrowRight, FileText, CheckCircle2, RotateCcw } from 'lucide-react';
import { ChatMessage, TitleBuilderInput, ProcessingStatus, KeywordData, TitleAnalysisResult } from '../types';
import { InputForm } from './InputForm';
import { ProcessingSteps } from './ProcessingSteps';
import { uploadAndProcessFile, getRecommendedTitles } from '../services/api';

interface Props {
  onShowReport: (keywords: KeywordData[], recommendations: TitleAnalysisResult[]) => void;
}

export const AgentChat: React.FC<Props> = ({ onShowReport }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'welcome',
        role: 'assistant',
        type: 'text',
        content: '你好！我是标题制作智能体。请在下方填写商品信息并上传搜索词表格，我将为您生成高权重的SEO标题方案。',
        timestamp: Date.now()
    }
  ]);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [processingStep, setProcessingStep] = useState(0);
  
  // Stored data for the report
  const [resultData, setResultData] = useState<{keywords: KeywordData[], recs: TitleAnalysisResult[]} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, processingStep]);

  const handleFormSubmit = async (data: TitleBuilderInput) => {
    setStatus('processing');
    setProcessingStep(0);

    // 1. Add User Message (Echo Input)
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        type: 'form_summary',
        data: data,
        timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Add Agent Progress Message
    const progressMsgId = (Date.now() + 1).toString();
    const progressMsg: ChatMessage = {
        id: progressMsgId,
        role: 'assistant',
        type: 'progress',
        data: data, // Pass input data to show summary in steps
        timestamp: Date.now() + 1
    };
    setMessages(prev => [...prev, progressMsg]);

    // 3. Simulate Processing
    try {
        // Step 1: Upload
        setProcessingStep(0);
        const rawKeywords = await uploadAndProcessFile(data.file!);
        await new Promise(r => setTimeout(r, 800));

        // Step 2
        setProcessingStep(1);
        await new Promise(r => setTimeout(r, 800));

        // Step 3
        setProcessingStep(2);
        await new Promise(r => setTimeout(r, 800));

        // Step 4: Generation
        setProcessingStep(3);
        const recs = await getRecommendedTitles(rawKeywords);
        await new Promise(r => setTimeout(r, 1000));

        // Step 5
        setProcessingStep(4);
        await new Promise(r => setTimeout(r, 800));

        // Step 6
        setProcessingStep(5);
        await new Promise(r => setTimeout(r, 600));

        // Save Data
        setResultData({ keywords: rawKeywords, recs });
        setStatus('completed');

        // 4. Add Result Link Message
        const resultMsg: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            type: 'result_link',
            content: '分析完成！我已为您生成了多维度标题方案。',
            timestamp: Date.now() + 2
        };
        setMessages(prev => [...prev, resultMsg]);

    } catch (error) {
        console.error(error);
        setStatus('error');
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            type: 'text',
            content: '抱歉，分析过程中发生了错误，请重试。',
            timestamp: Date.now()
        }]);
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResultData(null);
    setMessages([
        {
            id: 'welcome-reset',
            role: 'assistant',
            type: 'text',
            content: '已重置。请重新输入商品信息。',
            timestamp: Date.now()
        }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Message List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm
                    ${msg.role === 'assistant' ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-600'}
                `}>
                    {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>

                {/* Content Bubble */}
                <div className={`flex flex-col max-w-[85%] md:max-w-[75%]
                    ${msg.role === 'user' ? 'items-end' : 'items-start'}
                `}>
                    <div className="text-xs text-slate-400 mb-1 px-1">
                        {msg.role === 'assistant' ? 'SealSeek 智能体' : '我'}
                    </div>

                    {msg.type === 'text' && (
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 text-slate-700 leading-relaxed">
                            {msg.content}
                        </div>
                    )}

                    {msg.type === 'form_summary' && msg.data && (
                        <div className="bg-indigo-50 p-4 rounded-2xl rounded-tr-none border border-indigo-100 text-indigo-900 text-sm">
                            <div className="font-semibold mb-2 flex items-center gap-2">
                                <FileText size={16} /> 提交的分析请求
                            </div>
                            <div className="space-y-1 opacity-80">
                                <p>核心词: {msg.data.coreKeywords}</p>
                                <p>文件: {msg.data.file?.name}</p>
                                {msg.data.brandName && <p>品牌: {msg.data.brandName}</p>}
                            </div>
                        </div>
                    )}

                    {msg.type === 'progress' && (
                        <div className="bg-white p-2 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 w-full min-w-[300px] md:min-w-[400px]">
                            {/* Reusing ProcessingSteps but assuming it handles its own internal steps visual */}
                            {status === 'completed' ? (
                                <div className="p-4 flex items-center gap-3 text-green-600">
                                    <CheckCircle2 size={24} />
                                    <span className="font-medium">所有步骤执行完毕</span>
                                </div>
                            ) : (
                                <ProcessingSteps inputData={msg.data} currentStep={processingStep} />
                            )}
                        </div>
                    )}

                    {msg.type === 'result_link' && resultData && (
                        <div className="bg-white p-1 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 mt-2">
                            <div className="p-5">
                                <h3 className="font-bold text-slate-800 text-lg mb-2">🎉 标题方案已生成</h3>
                                <p className="text-slate-500 text-sm mb-4">
                                    基于 {resultData.keywords.length} 个搜索词数据，为您生成了 {resultData.recs.length} 个高权重标题。
                                </p>
                                <button 
                                    onClick={() => onShowReport(resultData.keywords, resultData.recs)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-100"
                                >
                                    查看完整报告 <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
        
        {/* Helper spacer for bottom input */}
        <div className="h-40"></div>
      </div>

      {/* Input Area (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-10 md:pl-64"> 
         {/* Offset left by sidebar width on desktop */}
         <div className="max-w-4xl mx-auto w-full">
            {status === 'idle' ? (
                <InputForm onSubmit={handleFormSubmit} />
            ) : (
                <div className="bg-white border-t border-slate-200 p-4">
                    <div className="max-w-3xl mx-auto flex gap-3">
                         <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-400 text-sm flex items-center">
                            {status === 'processing' ? '正在分析中，请稍候...' : '对话已结束，您可以查看报告或重新开始'}
                         </div>
                         {status === 'completed' && (
                            <button 
                                onClick={handleReset}
                                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <RotateCcw size={16} /> 新对话
                            </button>
                         )}
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};