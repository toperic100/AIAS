
// frontend/web/src/components/TemplateGallery.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Template } from '../types';

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 获取所有模板
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: () => api.get('/templates'),
  });

  // 筛选模板
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: '全部', icon: '🎯' },
    { id: 'ecommerce', name: '电商', icon: '🛒' },
    { id: 'social', name: '社交', icon: '💬' },
    { id: 'admin', name: '管理后台', icon: '📊' },
    { id: 'tool', name: '工具', icon: '🛠️' },
    { id: 'content', name: '内容', icon: '📝' },
    { id: 'saas', name: 'SaaS', icon: '☁️' },
  ];

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    const labels = {
      beginner: '入门',
      intermediate: '中级',
      advanced: '高级',
    };
    return { color: colors[difficulty as keyof typeof colors], label: labels[difficulty as keyof typeof labels] };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">加载模板中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部搜索栏 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">选择模板</h2>
          
          <div className="relative">
            <input
              type="text"
              placeholder="搜索模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 模板网格 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-slate-500">没有找到匹配的模板</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => {
                const difficultyBadge = getDifficultyBadge(template.difficulty);
                
                return (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => onSelectTemplate(template)}
                  >
                    {/* 模板缩略图 */}
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      {template.thumbnail ? (
                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-6xl">{categories.find(c => c.id === template.category)?.icon}</div>
                      )}
                    </div>

                    {/* 模板信息 */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{template.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyBadge.color}`}>
                          {difficultyBadge.label}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {template.description}
                      </p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {template.rating}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {template.downloads.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;

