
// frontend/web/src/components/TemplatePreview.tsx
import React, { useState } from 'react';
import { Template } from '../types';

interface TemplatePreviewProps {
  template: Template;
  onUseTemplate: (template: Template, customizations?: any) => void;
  onClose: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  onUseTemplate,
  onClose,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    template.specification.features
      .filter(f => !f.optional)
      .map(f => f.id)
  );

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleUseTemplate = () => {
    onUseTemplate(template, { features: selectedFeatures });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-slate-900">{template.name}</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {template.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧 - 详细信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 预览图 */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                {template.preview ? (
                  <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    📱
                  </div>
                )}
              </div>

              {/* 描述 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">描述</h3>
                <p className="text-slate-600">{template.description}</p>
              </div>

              {/* 功能列表 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">功能特性</h3>
                <div className="space-y-2">
                  {template.specification.features.map(feature => (
                    <label
                      key={feature.id}
                      className={`flex items-start p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      } ${!feature.optional ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature.id)}
                        onChange={() => feature.optional && toggleFeature(feature.id)}
                        disabled={!feature.optional}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-900">{feature.name}</span>
                          {!feature.optional && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded">
                              必选
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            feature.priority === 'high' ? 'bg-red-100 text-red-800' :
                            feature.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {feature.priority === 'high' ? '高' : feature.priority === 'medium' ? '中' : '低'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 技术栈 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">技术栈</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">前端</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.techStack.frontend.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {template.techStack.backend && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">后端</h4>
                      <div className="flex flex-wrap gap-2">
                        {template.techStack.backend.map(tech => (
                          <span key={tech} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧 - 元信息 */}
            <div className="space-y-4">
              {/* 统计信息 */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">难度</span>
                    <span className="font-medium text-slate-900">
                      {template.difficulty === 'beginner' ? '入门' :
                       template.difficulty === 'intermediate' ? '中级' : '高级'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">评分</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-slate-900">{template.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">下载量</span>
                    <span className="font-medium text-slate-900">
                      {template.downloads.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">版本</span>
                    <span className="font-medium text-slate-900">{template.version}</span>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-2">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 作者 */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">作者</h4>
                <p className="text-slate-900">{template.author}</p>
              </div>

              {/* 链接 */}
              {(template.documentation || template.repository) && (
                <div className="space-y-2">
                  {template.documentation && (
                    <a
                      href={template.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center rounded-lg transition-colors"
                    >
                      📚 查看文档
                    </a>
                  )}
                  {template.repository && (
                    <a
                      href={template.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center rounded-lg transition-colors"
                    >
                      💻 查看源码
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="text-sm text-slate-600">
            已选择 <span className="font-medium text-slate-900">{selectedFeatures.length}</span> 个功能
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUseTemplate}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            >
              使用此模板
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;

