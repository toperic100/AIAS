// frontend/web/src/components/CodeEditor.tsx
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  generatedCode: any;
  onCodeChange: (code: any) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ generatedCode, onCodeChange }) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!generatedCode || !generatedCode.files) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">还没有生成代码</h3>
          <p className="text-slate-500">在对话标签中描述你的需求,AI会自动生成代码</p>
        </div>
      </div>
    );
  }

  const filteredFiles = generatedCode.files.filter((file: any) =>
    file.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
  };

  const handleCodeUpdate = (value: string | undefined) => {
    if (!selectedFile || !value) return;

    const updatedFiles = generatedCode.files.map((f: any) =>
      f.path === selectedFile.path ? { ...f, content: value } : f
    );

    onCodeChange({
      ...generatedCode,
      files: updatedFiles,
    });

    setSelectedFile({ ...selectedFile, content: value });
  };

  const getLanguageFromPath = (path: string) => {
    const ext = path.split('.').pop();
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      css: 'css',
      scss: 'scss',
      html: 'html',
      md: 'markdown',
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const organizeFilesByDirectory = (files: any[]) => {
    const tree: Record<string, any[]> = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
      
      if (!tree[dir]) {
        tree[dir] = [];
      }
      tree[dir].push(file);
    });

    return tree;
  };

  const fileTree = organizeFilesByDirectory(filteredFiles);

  return (
    <div className="h-full flex bg-slate-50">
      {/* File Tree Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-4">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文件..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase">文件</span>
              <span className="text-xs text-slate-400">{generatedCode.files.length} 个</span>
            </div>

            {Object.entries(fileTree).map(([dir, files]) => (
              <div key={dir} className="mb-4">
                {dir !== 'root' && (
                  <div className="flex items-center px-2 py-1 text-sm font-medium text-slate-600 mb-1">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {dir}
                  </div>
                )}
                
                {files.map((file: any) => {
                  const fileName = file.path.split('/').pop();
                  const isSelected = selectedFile?.path === file.path;
                  
                  return (
                    <button
                      key={file.path}
                      onClick={() => handleFileSelect(file)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium truncate">{fileName}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 ml-6 truncate">
                        {file.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            {/* Editor Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="font-medium text-slate-900">{selectedFile.path}</div>
                  <div className="text-xs text-slate-500">{selectedFile.description}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedFile.content)}
                  className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </button>
                
                <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                  <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageFromPath(selectedFile.path)}
                value={selectedFile.content}
                onChange={handleCodeUpdate}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">选择一个文件开始编辑</h3>
              <p className="text-slate-500">从左侧文件树中选择文件</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;