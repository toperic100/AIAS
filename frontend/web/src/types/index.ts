
// frontend/web/src/types/index.ts

/**
 * 用户类型
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 项目类型
 */
export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'web' | 'mobile' | 'hybrid';
  status: 'draft' | 'generating' | 'ready' | 'deployed';
  specificationId?: string;
  generatedCodeId?: string;
  deploymentId?: string;
  fileCount: number;
  progress?: number;
  currentStep?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 应用规格
 */
export interface Specification {
  id: string;
  projectId: string;
  appType: 'web' | 'mobile' | 'hybrid';
  category: string;
  features: Feature[];
  dataModels: DataModel[];
  uiComponents: UIComponent[];
  businessLogic: BusinessLogic[];
  integrations: Integration[];
  designPreferences: DesignPreference;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 功能特性
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  complexity: number;
  dependencies?: string[];
}

/**
 * 数据模型
 */
export interface DataModel {
  name: string;
  description?: string;
  fields: DataField[];
  relationships?: Relationship[];
}

export interface DataField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  required: boolean;
  validation?: string;
  defaultValue?: any;
}

export interface Relationship {
  type: 'oneToOne' | 'oneToMany' | 'manyToMany';
  target: string;
  description?: string;
}

/**
 * UI组件
 */
export interface UIComponent {
  type: string;
  page?: string;
  properties: Record<string, any>;
  children?: UIComponent[];
}

/**
 * 业务逻辑
 */
export interface BusinessLogic {
  trigger: string;
  actions: string[];
  conditions?: string[];
  errorHandling?: string;
}

/**
 * 第三方集成
 */
export interface Integration {
  service: string;
  purpose: string;
  required: boolean;
}

/**
 * 设计偏好
 */
export interface DesignPreference {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: string;
  layout: string;
  responsive: boolean;
}

/**
 * 生成的代码
 */
export interface GeneratedCode {
  id: string;
  projectId: string;
  specificationId: string;
  projectStructure: ProjectStructure;
  files: GeneratedFile[];
  dependencies: Dependencies;
  configuration: Configuration;
  buildCommand?: string;
  runCommand?: string;
  createdAt: Date;
}

export interface ProjectStructure {
  type: 'react' | 'nextjs' | 'react-native' | 'vue';
  framework: string;
  buildTool: string;
  stateManagement?: string;
  routing?: string;
  uiLibrary?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

export interface Dependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export interface Configuration {
  env: Record<string, string>;
  scripts: Record<string, string>;
  eslint?: any;
  tsconfig?: any;
}

/**
 * 部署记录
 */
export interface Deployment {
  id: string;
  projectId: string;
  platform: 'vercel' | 'netlify' | 'aws' | 'custom';
  url?: string;
  status: 'pending' | 'building' | 'success' | 'failed';
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 消息类型
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  suggestions?: string[];
  clarificationNeeded?: boolean;
  confidence?: number;
}

/**
 * API响应类型
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * 表单值类型
 */
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateProjectForm {
  name: string;
  description?: string;
  type: 'web' | 'mobile' | 'hybrid';
  template?: string;
}

/**
 * 模板类型
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  preview?: string;
  features: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  downloads: number;
  rating: number;
  author: string;
}

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

/**
 * 活动日志
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}