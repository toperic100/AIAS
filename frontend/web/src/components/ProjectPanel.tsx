
// frontend/web/src/components/ProjectPanel.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ProjectPanelProps {
  currentProject: any;
  onProjectSelect: (project: any) => void;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({ currentProject, onProjectSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 获取项目列表
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('加载项目失败');
      return response.json();
    },
  });

  const filteredProjects = projects.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">我的项目</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">加载中...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-500 text-sm">
              {searchQuery ? '没有找到匹配的项目' : '还没有项目'}
            </p>
            {!searchQuery && (
              <button className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                创建第一个项目
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((project: any) => (
            <button
              key={project.id}
              onClick={() => onProjectSelect(project)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                currentProject?.id === project.id
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentProject?.id === project.id
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                      : 'bg-slate-200'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      currentProject?.id === project.id ? 'text-white' : 'text-slate-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate ${
                      currentProject?.id === project.id ? 'text-blue-900' : 'text-slate-900'
                    }`}>
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {project.description || '无描述'}
                    </p>
                  </div>
                </div>
                
                {project.status === 'generating' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    生成中
                  </span>
                )}
                {project.status === 'ready' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    就绪
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {project.fileCount || 0} 文件
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
                
                {currentProject?.id === project.id && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Progress Bar for Generating */}
              {project.status === 'generating' && (
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {project.currentStep || '正在生成...'}
                  </p>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-500 mb-3">
          <span className="font-medium">{filteredProjects.length}</span> 个项目
        </div>
        
        <button className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm font-medium text-sm">
          <svg className="w-4 h-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建项目
        </button>
      </div>
    </div>
  );
};

export default ProjectPanel;