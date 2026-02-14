
// backend/template-service/src/templates/social-blog.template.ts
import { Template } from '../types/template.types';

export const socialBlogTemplate: Template = {
  id: 'social-blog',
  name: '个人博客',
  description: '功能完善的个人博客系统,支持Markdown编辑、分类标签、评论等',
  category: 'social',
  thumbnail: '/templates/blog-thumb.png',
  preview: '/templates/blog-preview.png',
  tags: ['博客', 'Markdown', '文章', '评论', 'SEO'],
  difficulty: 'beginner',
  downloads: 8923,
  rating: 4.8,
  author: 'App Builder Team',
  version: '1.0.0',
  createdAt: '2024-01-20T00:00:00Z',
  updatedAt: '2024-02-05T00:00:00Z',
  
  techStack: {
    frontend: ['React', 'TypeScript', 'TailwindCSS', 'MDX'],
    backend: ['NestJS', 'TypeORM', 'PostgreSQL'],
    database: ['PostgreSQL'],
    deployment: ['Vercel'],
  },
  
  features: [
    'Markdown编辑器',
    '文章分类和标签',
    '评论系统',
    '文章搜索',
    'SEO优化',
    'RSS订阅',
    '代码高亮',
    '阅读统计',
  ],
  
  specification: {
    appType: 'web',
    category: 'blog',
    
    features: [
      {
        id: 'article-management',
        name: '文章管理',
        description: '创建、编辑、删除文章,支持Markdown格式',
        priority: 'high',
        complexity: 7,
      },
      {
        id: 'categories-tags',
        name: '分类和标签',
        description: '文章分类和标签管理',
        priority: 'high',
        complexity: 5,
      },
      {
        id: 'comment-system',
        name: '评论系统',
        description: '文章评论功能,支持回复',
        priority: 'medium',
        complexity: 6,
      },
      {
        id: 'search',
        name: '文章搜索',
        description: '全文搜索功能',
        priority: 'medium',
        complexity: 5,
      },
      {
        id: 'seo',
        name: 'SEO优化',
        description: 'meta标签、sitemap、robots.txt',
        priority: 'medium',
        complexity: 4,
      },
      {
        id: 'analytics',
        name: '阅读统计',
        description: '文章阅读量、访客统计',
        priority: 'low',
        complexity: 5,
        optional: true,
      },
    ],
    
    dataModels: [
      {
        name: 'Post',
        description: '文章',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'slug', type: 'string', required: true, unique: true },
          { name: 'content', type: 'text', required: true },
          { name: 'excerpt', type: 'string', required: false },
          { name: 'coverImage', type: 'string', required: false },
          { name: 'authorId', type: 'uuid', required: true },
          { name: 'categoryId', type: 'uuid', required: false },
          { name: 'tags', type: 'array', required: false },
          { name: 'status', type: 'string', required: true, defaultValue: 'draft' },
          { name: 'publishedAt', type: 'date', required: false },
          { name: 'viewCount', type: 'number', required: false, defaultValue: 0 },
          { name: 'likeCount', type: 'number', required: false, defaultValue: 0 },
          { name: 'seoTitle', type: 'string', required: false },
          { name: 'seoDescription', type: 'string', required: false },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '文章作者' },
          { type: 'manyToOne', target: 'Category', description: '文章分类' },
          { type: 'oneToMany', target: 'Comment', description: '文章评论' },
        ],
        indexes: ['slug', 'status', 'publishedAt'],
      },
      {
        name: 'Category',
        description: '分类',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'slug', type: 'string', required: true, unique: true },
          { name: 'description', type: 'string', required: false },
          { name: 'postCount', type: 'number', required: false, defaultValue: 0 },
        ],
        relationships: [
          { type: 'oneToMany', target: 'Post', description: '分类下的文章' },
        ],
      },
      {
        name: 'Comment',
        description: '评论',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'postId', type: 'uuid', required: true },
          { name: 'userId', type: 'uuid', required: false },
          { name: 'authorName', type: 'string', required: true },
          { name: 'authorEmail', type: 'string', required: true },
          { name: 'content', type: 'string', required: true },
          { name: 'parentId', type: 'uuid', required: false },
          { name: 'status', type: 'string', required: true, defaultValue: 'pending' },
          { name: 'createdAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'Post', description: '评论所属文章' },
        ],
      },
    ],
    
    uiComponents: [
      {
        type: 'MarkdownEditor',
        name: 'PostEditor',
        page: 'admin',
        properties: {
          toolbar: true,
          preview: true,
          autoSave: true,
          imageUpload: true,
        },
      },
      {
        type: 'PostCard',
        name: 'PostListItem',
        properties: {
          showCover: true,
          showExcerpt: true,
          showMeta: true,
        },
      },
      {
        type: 'CommentList',
        name: 'PostComments',
        properties: {
          nested: true,
          maxDepth: 3,
          pagination: true,
        },
      },
    ],
    
    businessLogic: [
      {
        name: '发布文章',
        trigger: '作者点击发布按钮',
        actions: [
          '验证文章内容',
          '生成SEO信息',
          '更新发布状态',
          '更新发布时间',
          '触发sitemap更新',
        ],
        conditions: ['标题不为空', '内容不为空'],
      },
      {
        name: '提交评论',
        trigger: '用户提交评论',
        actions: [
          '验证评论内容',
          '保存评论',
          '发送邮件通知作者',
          '更新评论数量',
        ],
        conditions: ['评论内容不为空', '邮箱格式正确'],
      },
    ],
    
    integrations: [
      {
        service: 'Cloudinary',
        purpose: '图片存储',
        required: false,
      },
      {
        service: 'Algolia',
        purpose: '全文搜索',
        required: false,
      },
    ],
    
    designPreferences: {
      theme: 'light',
      colorScheme: 'gray',
      primaryColor: '#1F2937',
      layout: 'classic',
      responsive: true,
      font: 'Georgia',
    },
    
    routes: [
      { path: '/', name: '首页', component: 'HomePage' },
      { path: '/posts/:slug', name: '文章详情', component: 'PostPage' },
      { path: '/category/:slug', name: '分类', component: 'CategoryPage' },
      { path: '/tag/:name', name: '标签', component: 'TagPage' },
      { path: '/admin/posts', name: '文章管理', component: 'AdminPostsPage', protected: true },
    ],
  },
  
  documentation: 'https://docs.appbuilder.com/templates/blog',
  repository: 'https://github.com/appbuilder/templates/blog',
};