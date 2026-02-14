
// frontend/web/src/components/ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestions?: string[];
    clarificationNeeded?: boolean;
  };
}

interface ChatInterfaceProps {
  onCodeGenerated: (code: any) => void;
  currentProject: any;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onCodeGenerated, currentProject }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好!我是灵光AI助手。请描述你想创建的应用,我会帮你设计和生成代码。\n\n你可以这样开始:\n- "我想做一个电商网站"\n- "帮我创建一个任务管理应用"\n- "我需要一个博客系统"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息并解析需求
  const parseRequirementMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await fetch('/api/nlp/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('解析失败');
      return response.json();
    },
    onSuccess: (data) => {
      // 添加AI响应
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: {
          suggestions: data.suggestions,
          clarificationNeeded: data.needsClarification,
        },
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 如果需求已完整,触发代码生成
      if (data.isComplete) {
        handleCodeGeneration(data.specification);
      }
    },
    onError: (error: any) => {
      toast.error('处理失败: ' + error.message);
    },
  });

  // 生成代码
  const generateCodeMutation = useMutation({
    mutationFn: async (specification: any) => {
      const response = await fetch('/api/codegen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specification }),
      });

      if (!response.ok) throw new Error('代码生成失败');
      return response.json();
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      onCodeGenerated(data);
      
      toast.success('代码生成成功!');
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ 代码生成完成!\n\n已生成 ${data.files.length} 个文件,包括:\n${data.files.slice(0, 5).map((f: any) => `- ${f.path}`).join('\n')}\n${data.files.length > 5 ? `\n...还有 ${data.files.length - 5} 个文件` : ''}\n\n你可以切换到"代码"标签查看,或到"预览"标签查看效果。`,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast.error('代码生成失败: ' + error.message);
    },
  });

  const handleCodeGeneration = (specification: any) => {
    setIsGenerating(true);
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'system',
        content: '🚀 开始生成代码...',
        timestamp: new Date(),
      },
    ]);

    generateCodeMutation.mutate(specification);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    parseRequirementMutation.mutate(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-900'
                  : 'bg-white border border-slate-200 text-slate-900'
              } rounded-2xl px-6 py-4 shadow-sm`}
            >
              {/* Message Header */}
              <div className="flex items-center space-x-2 mb-2">
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                {message.role === 'system' && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <span className={`text-xs font-medium ${
                  message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {message.role === 'user' ? '你' : message.role === 'assistant' ? '灵光AI' : '系统'}
                </span>
                <span className={`text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Message Content */}
              <div className={`prose prose-sm max-w-none ${
                message.role === 'user' ? 'prose-invert' : ''
              }`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>

              {/* Suggestions */}
              {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-600 mb-2">你可能想:</p>
                  <div className="flex flex-wrap gap-2">
                    {message.metadata.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {(parseRequirementMutation.isPending || isGenerating) && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-slate-600">
                  {isGenerating ? '正在生成代码...' : 'AI正在思考...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {['我想做一个电商网站', '创建待办事项应用', '帮我做个博客系统'].map((quick) => (
              <button
                key={quick}
                onClick={() => setInput(quick)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-colors"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="描述你想要的应用... (Shift+Enter 换行)"
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={parseRequirementMutation.isPending || isGenerating}
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                {input.length}/2000
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || parseRequirementMutation.isPending || isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl transition-all shadow-sm disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            提示: 尽可能详细地描述你的需求,包括功能、设计风格、用户群体等
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;