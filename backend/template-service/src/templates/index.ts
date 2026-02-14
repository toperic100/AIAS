
// backend/template-service/src/templates/index.ts

// 电商模板
export { ecommerceBasicTemplate } from './ecommerce-basic.template';
export { ecommerceAdvancedTemplate } from './ecommerce-advanced.template';

// 社交媒体模板
export { socialBlogTemplate } from './social-blog.template';
export { socialCommunityTemplate } from './social-community.template';

// 管理后台模板
export { adminDashboardTemplate } from './admin-dashboard.template';
export { adminCMSTemplate } from './admin-cms.template';

// 工具应用模板
export { toolTodoTemplate } from './tool-todo.template';
export { toolNotesTemplate } from './tool-notes.template';

// 内容管理模板
export { contentBlogTemplate } from './content-blog.template';
export { contentPortfolioTemplate } from './content-portfolio.template';

// SaaS模板
export { saasStarterTemplate } from './saas-starter.template';
export { saasAnalyticsTemplate } from './saas-analytics.template';

// 模板占位符(待实现)
export const ecommerceAdvancedTemplate = {
  ...ecommerceBasicTemplate,
  id: 'ecommerce-advanced',
  name: '电商高级版',
  description: '功能完整的电商平台,包含商家入驻、多商户管理、营销工具等',
  difficulty: 'advanced' as const,
};

export const socialCommunityTemplate = {
  ...socialBlogTemplate,
  id: 'social-community',
  name: '社区论坛',
  description: '在线社区平台,支持话题讨论、用户关注、私信等',
  difficulty: 'intermediate' as const,
};

export const adminCMSTemplate = {
  ...adminDashboardTemplate,
  id: 'admin-cms',
  name: '内容管理系统',
  description: '灵活的CMS系统,支持自定义内容类型和工作流',
  difficulty: 'advanced' as const,
};

export const toolNotesTemplate = {
  ...toolTodoTemplate,
  id: 'tool-notes',
  name: '笔记应用',
  description: '功能丰富的笔记应用,支持Markdown、标签、搜索等',
  category: 'tool' as const,
};

export const contentBlogTemplate = {
  ...socialBlogTemplate,
  id: 'content-blog',
  name: '内容博客',
  category: 'content' as const,
};

export const contentPortfolioTemplate = {
  ...socialBlogTemplate,
  id: 'content-portfolio',
  name: '个人作品集',
  description: '展示个人作品和项目的作品集网站',
  category: 'content' as const,
};

export const saasStarterTemplate = {
  ...adminDashboardTemplate,
  id: 'saas-starter',
  name: 'SaaS启动模板',
  description: 'SaaS应用的完整起始模板,包含用户管理、订阅计费等',
  category: 'saas' as const,
};

export const saasAnalyticsTemplate = {
  ...adminDashboardTemplate,
  id: 'saas-analytics',
  name: '数据分析平台',
  description: '数据分析和可视化平台模板',
  category: 'saas' as const,
};