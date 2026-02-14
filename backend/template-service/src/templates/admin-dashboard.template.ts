
// backend/template-service/src/templates/admin-dashboard.template.ts
import { Template } from '../types/template.types';

export const adminDashboardTemplate: Template = {
  id: 'admin-dashboard',
  name: '管理后台',
  description: '功能强大的管理后台模板,包含数据统计、用户管理、权限控制等',
  category: 'admin',
  thumbnail: '/templates/admin-dash-thumb.png',
  preview: '/templates/admin-dash-preview.png',
  tags: ['管理后台', '数据统计', '权限管理', 'CRUD', '图表'],
  difficulty: 'intermediate',
  downloads: 12456,
  rating: 4.9,
  author: 'App Builder Team',
  version: '1.0.0',
  createdAt: '2024-01-25T00:00:00Z',
  updatedAt: '2024-02-10T00:00:00Z',
  
  techStack: {
    frontend: ['React', 'TypeScript', 'Ant Design', 'ECharts', 'React Query'],
    backend: ['NestJS', 'TypeORM', 'PostgreSQL'],
    database: ['PostgreSQL', 'Redis'],
    deployment: ['AWS', 'Docker'],
  },
  
  features: [
    '数据可视化Dashboard',
    '用户和角色管理',
    '权限控制(RBAC)',
    'CRUD操作',
    '数据导入导出',
    '操作日志',
    '系统设置',
    '实时通知',
  ],
  
  specification: {
    appType: 'web',
    category: 'admin',
    
    features: [
      {
        id: 'dashboard',
        name: '数据仪表盘',
        description: '展示关键指标和图表',
        priority: 'high',
        complexity: 7,
      },
      {
        id: 'user-management',
        name: '用户管理',
        description: '用户CRUD、状态管理、批量操作',
        priority: 'high',
        complexity: 8,
      },
      {
        id: 'role-permission',
        name: '角色权限',
        description: 'RBAC权限控制系统',
        priority: 'high',
        complexity: 9,
      },
      {
        id: 'data-table',
        name: '数据表格',
        description: '可配置的数据表格,支持排序、筛选、导出',
        priority: 'high',
        complexity: 7,
      },
      {
        id: 'form-builder',
        name: '表单生成器',
        description: '动态表单构建和验证',
        priority: 'medium',
        complexity: 8,
      },
      {
        id: 'audit-log',
        name: '审计日志',
        description: '记录所有重要操作',
        priority: 'medium',
        complexity: 6,
      },
      {
        id: 'notifications',
        name: '通知系统',
        description: '实时消息推送',
        priority: 'medium',
        complexity: 7,
        optional: true,
      },
    ],
    
    dataModels: [
      {
        name: 'User',
        description: '用户',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'username', type: 'string', required: true, unique: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'password', type: 'string', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'avatar', type: 'string', required: false },
          { name: 'phone', type: 'string', required: false },
          { name: 'status', type: 'string', required: true, defaultValue: 'active' },
          { name: 'roleId', type: 'uuid', required: true },
          { name: 'lastLoginAt', type: 'date', required: false },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'Role', description: '用户角色' },
          { type: 'oneToMany', target: 'AuditLog', description: '操作日志' },
        ],
        indexes: ['username', 'email', 'status'],
      },
      {
        name: 'Role',
        description: '角色',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'name', type: 'string', required: true, unique: true },
          { name: 'description', type: 'string', required: false },
          { name: 'permissions', type: 'array', required: true },
          { name: 'isSystem', type: 'boolean', required: true, defaultValue: false },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'oneToMany', target: 'User', description: '拥有此角色的用户' },
        ],
      },
      {
        name: 'Permission',
        description: '权限',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'resource', type: 'string', required: true },
          { name: 'action', type: 'string', required: true },
          { name: 'description', type: 'string', required: false },
        ],
      },
      {
        name: 'AuditLog',
        description: '审计日志',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'action', type: 'string', required: true },
          { name: 'resource', type: 'string', required: true },
          { name: 'resourceId', type: 'string', required: false },
          { name: 'changes', type: 'object', required: false },
          { name: 'ipAddress', type: 'string', required: false },
          { name: 'userAgent', type: 'string', required: false },
          { name: 'createdAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '操作用户' },
        ],
        indexes: ['userId', 'action', 'createdAt'],
      },
    ],
    
    uiComponents: [
      {
        type: 'DashboardCard',
        name: 'StatCard',
        properties: {
          showTrend: true,
          showChart: true,
          clickable: true,
        },
      },
      {
        type: 'DataTable',
        name: 'AdminTable',
        properties: {
          pagination: true,
          sorting: true,
          filtering: true,
          selection: true,
          export: true,
        },
      },
      {
        type: 'RoleSelector',
        name: 'RoleDropdown',
        properties: {
          multiple: false,
          showPermissions: true,
        },
      },
      {
        type: 'PermissionMatrix',
        name: 'PermissionGrid',
        properties: {
          groupByResource: true,
          editable: true,
        },
      },
    ],
    
    businessLogic: [
      {
        name: '分配角色',
        trigger: '管理员为用户分配角色',
        actions: [
          '检查权限',
          '更新用户角色',
          '记录审计日志',
          '刷新用户权限缓存',
        ],
        conditions: ['当前用户有user.update权限'],
      },
      {
        name: '批量操作',
        trigger: '管理员执行批量操作',
        actions: [
          '验证选中项',
          '执行批量操作',
          '记录每项操作结果',
          '返回操作摘要',
        ],
        conditions: ['至少选中一项', '有相应权限'],
      },
      {
        name: '数据导出',
        trigger: '用户点击导出按钮',
        actions: [
          '获取筛选后的数据',
          '生成Excel/CSV文件',
          '触发文件下载',
          '记录导出日志',
        ],
        conditions: ['有导出权限', '数据不为空'],
      },
    ],
    
    integrations: [
      {
        service: 'Redis',
        purpose: '缓存和会话管理',
        required: true,
      },
      {
        service: 'ElasticSearch',
        purpose: '日志搜索',
        required: false,
      },
    ],
    
    designPreferences: {
      theme: 'light',
      colorScheme: 'blue',
      primaryColor: '#1890FF',
      layout: 'sidebar',
      responsive: true,
    },
    
    routes: [
      { path: '/dashboard', name: '仪表盘', component: 'DashboardPage' },
      { path: '/users', name: '用户管理', component: 'UsersPage', protected: true, roles: ['admin'] },
      { path: '/roles', name: '角色管理', component: 'RolesPage', protected: true, roles: ['admin'] },
      { path: '/logs', name: '审计日志', component: 'LogsPage', protected: true, roles: ['admin'] },
      { path: '/settings', name: '系统设置', component: 'SettingsPage', protected: true, roles: ['admin'] },
    ],
  },
  
  documentation: 'https://docs.appbuilder.com/templates/admin-dashboard',
  repository: 'https://github.com/appbuilder/templates/admin-dashboard',
};