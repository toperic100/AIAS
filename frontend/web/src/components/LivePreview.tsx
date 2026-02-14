
// frontend/web/src/components/LivePreview.tsx
import React, { useState, useEffect, useRef } from 'react';

interface LivePreviewProps {
  generatedCode: any;
}

const LivePreview: React.FC<LivePreviewProps> = ({ generatedCode }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (generatedCode && generatedCode.files) {
      updatePreview();
    }
  }, [generatedCode]);

  const updatePreview = async () => {
    if (!generatedCode || !iframeRef.current) return;

    setIsLoading(true);

    try {
      // 构建预览HTML
      const previewHTML = buildPreviewHTML(generatedCode);
      
      // 更新iframe
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (doc) {
        doc.open();
        doc.write(previewHTML);
        doc.close();
      }
    } catch (error) {
      console.error('预览更新失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildPreviewHTML = (code: any): string => {
    // 查找主HTML文件或构建HTML
    const indexHTML = code.files.find((f: any) => f.path.includes('index.html'));
    
    if (indexHTML) {
      return indexHTML.content;
    }

    // 如果是React应用,构建预览HTML
    const appFile = code.files.find((f: any) => f.path.includes('App.tsx') || f.path.includes('App.jsx'));
    const mainFile = code.files.find((f: any) => f.path.includes('main.tsx') || f.path.includes('main.jsx'));

    if (appFile) {
      return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    ${appFile.content}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>预览</title>
</head>
<body>
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; color: #64748b;">
    <div>
      <h2>无法生成预览</h2>
      <p>请在代码标签中查看生成的文件</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '100%', height: '100%' };
    }
  };

  if (!generatedCode || !generatedCode.files) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">还没有可预览的内容</h3>
          <p className="text-slate-500">生成代码后,这里会显示应用预览</p>
        </div>
      </div>
    );
  }

  const dimensions = getPreviewDimensions();

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">预览模式:</span>
            
            <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
              {[
                { mode: 'desktop', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: '桌面' },
                { mode: 'tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z', label: '平板' },
                { mode: 'mobile', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', label: '手机' },
              ].map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    previewMode === mode
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title={label}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={updatePreview}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
            
            <button className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              新窗口打开
            </button>
          </div>
        </div>

        {/* Dimension Display */}
        {previewMode !== 'desktop' && (
          <div className="mt-2 text-xs text-slate-500">
            尺寸: {dimensions.width} × {dimensions.height}
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-3 text-sm text-slate-600">加载预览...</p>
            </div>
          </div>
        )}

        <div
          className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="应用预览"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          />
        </div>
      </div>

      {/* Preview Info Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-4">
            <span>📱 响应式预览</span>
            <span>⚡ 实时刷新</span>
            <span>🎨 所见即所得</span>
          </div>
          <div>
            提示: 修改代码后点击"刷新"查看最新效果
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;