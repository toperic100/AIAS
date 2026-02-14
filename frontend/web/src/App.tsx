
// frontend/web/src/App.tsx
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ChatInterface from './components/ChatInterface';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';
import ProjectPanel from './components/ProjectPanel';

const queryClient = new QueryClient();

function App() {
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'preview'>('chat');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  灵光平台
                </h1>
                <p className="text-sm text-slate-500">AI驱动的应用生成器</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {currentProject && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">项目:</span>
                  <span className="text-sm text-slate-900">{currentProject.name}</span>
                </div>
              )}
              
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
                <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建项目
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Project Panel */}
          <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
            <ProjectPanel
              currentProject={currentProject}
              onProjectSelect={setCurrentProject}
            />
          </aside>

          {/* Center - Main Work Area */}
          <main className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 px-6 py-2">
              <div className="flex space-x-1">
                {[
                  { id: 'chat', label: '对话', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                  { id: 'code', label: '代码', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                  { id: 'preview', label: '预览', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-b-2 border-blue-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' && (
                <ChatInterface
                  onCodeGenerated={setGeneratedCode}
                  currentProject={currentProject}
                />
              )}
              
              {activeTab === 'code' && (
                <CodeEditor
                  generatedCode={generatedCode}
                  onCodeChange={setGeneratedCode}
                />
              )}
              
              {activeTab === 'preview' && (
                <LivePreview
                  generatedCode={generatedCode}
                />
              )}
            </div>
          </main>

          {/* Right Sidebar - Context Panel */}
          <aside className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">项目信息</h3>
                {currentProject ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">应用类型</span>
                      <p className="font-medium text-slate-900">{currentProject.type || 'Web应用'}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">功能模块</span>
                      <p className="font-medium text-slate-900">{currentProject.features?.length || 0} 个</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">数据模型</span>
                      <p className="font-medium text-slate-900">{currentProject.dataModels?.length || 0} 个</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>选择或创建一个项目</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">快速操作</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 inline mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-sm font-medium">导出项目</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 inline mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium">部署应用</span>
                  </button>
                  <button className="w-full px-4 py-3 text-left bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 inline mr-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm font-medium">分享项目</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">使用模板</h3>
                <div className="space-y-2">
                  {['电商应用', '社交平台', '管理后台', '博客系统'].map(template => (
                    <button
                      key={template}
                      className="w-full px-4 py-3 text-left bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg transition-colors border border-blue-100"
                    >
                      <span className="text-sm font-medium text-slate-900">{template}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;