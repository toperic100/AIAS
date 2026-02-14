
// backend/template-service/src/types/template.types.ts

export type TemplateCategory = 
  | 'ecommerce'      // 电商
  | 'social'         // 社交
  | 'admin'          // 管理后台
  | 'tool'           // 工具
  | 'content'        // 内容管理
  | 'saas'           // SaaS应用
  | 'education'      // 教育
  | 'health'         // 健康医疗
  | 'finance';       // 金融

export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail?: string;
  preview?: string;
  tags: string[];
  difficulty: TemplateDifficulty;
  downloads: number;
  rating: number;
  author: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
  
  // 技术栈
  techStack: {
    frontend: string[];
    backend?: string[];
    database?: string[];
    deployment?: string[];
  };
  
  // 功能特性
  features: string[];
  
  // 应用规格
  specification: TemplateSpecification;
  
  // 演示数据
  demoData?: any;
  
  // 文档链接
  documentation?: string;
  
  // 源码链接
  repository?: string;
}

export interface TemplateSpecification {
  appType: 'web' | 'mobile' | 'hybrid';
  category: string;
  projectName?: string;
  
  features: TemplateFeature[];
  dataModels: TemplateDataModel[];
  uiComponents: TemplateUIComponent[];
  businessLogic: TemplateBusinessLogic[];
  integrations: TemplateIntegration[];
  designPreferences: TemplateDesignPreference;
  
  // 路由配置
  routes?: TemplateRoute[];
  
  // API端点
  apiEndpoints?: TemplateAPIEndpoint[];
}

export interface TemplateFeature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  complexity: number;
  dependencies?: string[];
  optional?: boolean; // 是否可选
}

export interface TemplateDataModel {
  name: string;
  description?: string;
  fields: TemplateField[];
  relationships?: TemplateRelationship[];
  indexes?: string[];
  validations?: any[];
}

export interface TemplateField {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  defaultValue?: any;
  validation?: string;
  description?: string;
}

export interface TemplateRelationship {
  type: 'oneToOne' | 'oneToMany' | 'manyToMany';
  target: string;
  description?: string;
  cascadeDelete?: boolean;
}

export interface TemplateUIComponent {
  type: string;
  name: string;
  page?: string;
  properties: Record<string, any>;
  children?: TemplateUIComponent[];
  responsive?: boolean;
}

export interface TemplateBusinessLogic {
  name: string;
  trigger: string;
  actions: string[];
  conditions?: string[];
  errorHandling?: string;
}

export interface TemplateIntegration {
  service: string;
  purpose: string;
  required: boolean;
  configRequired?: string[];
}

export interface TemplateDesignPreference {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: string;
  primaryColor?: string;
  secondaryColor?: string;
  layout: string;
  responsive: boolean;
  font?: string;
}

export interface TemplateRoute {
  path: string;
  name: string;
  component: string;
  protected?: boolean;
  roles?: string[];
}

export interface TemplateAPIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  protected?: boolean;
  parameters?: any[];
  response?: any;
}