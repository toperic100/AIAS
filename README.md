# AI-Powered App Builder Platform

## 项目概述
基于自然语言驱动的应用生成平台,用户通过对话即可生成完整的Web/Mobile应用。

## 核心功能
1. **自然语言理解** - 解析用户需求,生成结构化描述
2. **智能代码生成** - 基于模板和AI生成高质量代码
3. **实时预览** - 所见即所得的应用预览
4. **一键部署** - 自动化部署到云平台
5. **模板市场** - 丰富的行业模板库

## 技术架构
- 前端: React 18 + TypeScript + TailwindCSS
- 后端: NestJS + GraphQL
- AI: Claude API + LangChain
- 数据库: PostgreSQL + MongoDB + Redis
- 部署: Docker + Kubernetes

## 项目结构
```
app-builder-platform/
├── frontend/              # 前端应用
│   ├── web/              # Web端
│   └── mobile/           # 移动端
├── backend/              # 后端服务
│   ├── api-gateway/      # API网关
│   ├── nlp-service/      # NLP解析服务
│   ├── codegen-service/  # 代码生成服务
│   ├── preview-service/  # 预览服务
│   ├── template-service/ # 模板服务
│   └── deploy-service/   # 部署服务
├── ai/                   # AI模型和提示工程
├── infrastructure/       # 基础设施配置
└── docs/                 # 文档
```

## 快速开始
详见各子项目的README文件