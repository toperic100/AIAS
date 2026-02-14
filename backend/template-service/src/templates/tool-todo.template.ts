
// backend/template-service/src/templates/tool-todo.template.ts
import { Template } from '../types/template.types';

export const toolTodoTemplate: Template = {
  id: 'tool-todo',
  name: '待办事项',
  description: '简洁易用的任务管理应用,支持项目分组、优先级、截止日期等',
  category: 'tool',
  thumbnail: '/templates/todo-thumb.png',
  preview: '/templates/todo-preview.png',
  tags: ['待办', '任务管理', 'GTD', '效率工具'],
  difficulty: 'beginner',
  downloads: 6234,
  rating: 4.6,
  author: 'App Builder Team',
  version: '1.0.0',
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-12T00:00:00Z',
  
  techStack: {
    frontend: ['React', 'TypeScript', 'TailwindCSS', 'Zustand'],
    backend: ['NestJS', 'TypeORM', 'PostgreSQL'],
    database: ['PostgreSQL'],
    deployment: ['Vercel'],
  },
  
  features: [
    '任务创建和管理',
    '项目分组',
    '优先级设置',
    '截止日期',
    '任务标签',
    '拖拽排序',
    '完成统计',
    '离线支持',
  ],
  
  specification: {
    appType: 'web',
    category: 'productivity',
    
    features: [
      {
        id: 'task-crud',
        name: '任务管理',
        description: '创建、编辑、删除、完成任务',
        priority: 'high',
        complexity: 5,
      },
      {
        id: 'projects',
        name: '项目分组',
        description: '将任务组织到不同项目中',
        priority: 'high',
        complexity: 6,
      },
      {
        id: 'priority-due',
        name: '优先级和截止日期',
        description: '设置任务优先级和截止时间',
        priority: 'medium',
        complexity: 4,
      },
      {
        id: 'tags',
        name: '标签系统',
        description: '为任务添加标签便于分类',
        priority: 'medium',
        complexity: 5,
      },
      {
        id: 'drag-drop',
        name: '拖拽排序',
        description: '拖拽改变任务顺序',
        priority: 'low',
        complexity: 6,
        optional: true,
      },
      {
        id: 'statistics',
        name: '完成统计',
        description: '查看任务完成情况统计',
        priority: 'low',
        complexity: 5,
        optional: true,
      },
    ],
    
    dataModels: [
      {
        name: 'Task',
        description: '任务',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'text', required: false },
          { name: 'completed', type: 'boolean', required: true, defaultValue: false },
          { name: 'priority', type: 'string', required: false, defaultValue: 'medium' },
          { name: 'dueDate', type: 'date', required: false },
          { name: 'projectId', type: 'uuid', required: false },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'tags', type: 'array', required: false },
          { name: 'order', type: 'number', required: true, defaultValue: 0 },
          { name: 'completedAt', type: 'date', required: false },
          { name: 'createdAt', type: 'date', required: true },
          { name: 'updatedAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'manyToOne', target: 'User', description: '任务所属用户' },
          { type: 'manyToOne', target: 'Project', description: '任务所属项目' },
        ],
        indexes: ['userId', 'completed', 'dueDate'],
      },
      {
        name: 'Project',
        description: '项目',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'color', type: 'string', required: false },
          { name: 'icon', type: 'string', required: false },
          { name: 'userId', type: 'uuid', required: true },
          { name: 'taskCount', type: 'number', required: false, defaultValue: 0 },
          { name: 'createdAt', type: 'date', required: true },
        ],
        relationships: [
          { type: 'oneToMany', target: 'Task', description: '项目下的任务' },
        ],
      },
      {
        name: 'Tag',
        description: '标签',
        fields: [
          { name: 'id', type: 'uuid', required: true },
          { name: 'name', type: 'string', required: true },
          { name: 'color', type: 'string', required: false },
          { name: 'userId', type: 'uuid', required: true },
        ],
      },
    ],
    
    uiComponents: [
      {
        type: 'TaskList',
        name: 'TodoList',
        properties: {
          showCompleted: true,
          sortable: true,
          groupBy: 'project',
        },
      },
      {
        type: 'TaskItem',
        name: 'TodoItem',
        properties: {
          showPriority: true,
          showDueDate: true,
          showProject: true,
          editable: true,
        },
      },
      {
        type: 'TaskForm',
        name: 'AddTaskModal',
        properties: {
          quickAdd: true,
          showAdvanced: true,
        },
      },
      {
        type: 'ProjectSidebar',
        name: 'ProjectList',
        properties: {
          collapsible: true,
          showCount: true,
        },
      },
    ],
    
    businessLogic: [
      {
        name: '创建任务',
        trigger: '用户提交新任务表单',
        actions: [
          '验证任务标题',
          '保存任务到数据库',
          '更新项目任务数',
          '显示成功提示',
        ],
        conditions: ['标题不为空'],
      },
      {
        name: '完成任务',
        trigger: '用户勾选任务完成',
        actions: [
          '更新任务状态',
          '记录完成时间',
          '更新统计数据',
          '播放完成动画',
        ],
      },
      {
        name: '拖拽排序',
        trigger: '用户拖拽任务到新位置',
        actions: [
          '计算新的排序值',
          '更新任务顺序',
          '保存到数据库',
        ],
      },
    ],
    
    integrations: [
      {
        service: 'Google Calendar',
        purpose: '同步截止日期到日历',
        required: false,
      },
    ],
    
    designPreferences: {
      theme: 'auto',
      colorScheme: 'green',
      primaryColor: '#10B981',
      layout: 'minimal',
      responsive: true,
    },
    
    routes: [
      { path: '/', name: '今天', component: 'TodayPage', protected: true },
      { path: '/upcoming', name: '即将到来', component: 'UpcomingPage', protected: true },
      { path: '/project/:id', name: '项目', component: 'ProjectPage', protected: true },
      { path: '/completed', name: '已完成', component: 'CompletedPage', protected: true },
    ],
  },
  
  documentation: 'https://docs.appbuilder.com/templates/todo',
  repository: 'https://github.com/appbuilder/templates/todo',
};