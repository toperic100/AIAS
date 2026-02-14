// backend/template-service/src/template-manager.service.ts
import { Injectable } from '@nestjs/common';
import { Template, TemplateCategory } from './types/template.types';
import * as templates from './templates';

@Injectable()
export class TemplateManagerService {
  private templates: Map<string, Template> = new Map();

  constructor() {
    this.loadTemplates();
  }

  /**
   * 加载所有模板
   */
  private loadTemplates(): void {
    // 电商模板
    this.templates.set('ecommerce-basic', templates.ecommerceBasicTemplate);
    this.templates.set('ecommerce-advanced', templates.ecommerceAdvancedTemplate);
    
    // 社交媒体模板
    this.templates.set('social-blog', templates.socialBlogTemplate);
    this.templates.set('social-community', templates.socialCommunityTemplate);
    
    // 管理后台模板
    this.templates.set('admin-dashboard', templates.adminDashboardTemplate);
    this.templates.set('admin-cms', templates.adminCMSTemplate);
    
    // 工具应用模板
    this.templates.set('tool-todo', templates.toolTodoTemplate);
    this.templates.set('tool-notes', templates.toolNotesTemplate);
    
    // 内容管理模板
    this.templates.set('content-blog', templates.contentBlogTemplate);
    this.templates.set('content-portfolio', templates.contentPortfolioTemplate);
    
    // SaaS模板
    this.templates.set('saas-starter', templates.saasStarterTemplate);
    this.templates.set('saas-analytics', templates.saasAnalyticsTemplate);
  }

  /**
   * 获取所有模板
   */
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * 根据分类获取模板
   */
  getTemplatesByCategory(category: TemplateCategory): Template[] {
    return this.getAllTemplates().filter(t => t.category === category);
  }

  /**
   * 根据ID获取模板
   */
  getTemplateById(id: string): Template | undefined {
    return this.templates.get(id);
  }

  /**
   * 搜索模板
   */
  searchTemplates(query: string): Template[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTemplates().filter(template => 
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * 获取推荐模板
   */
  getRecommendedTemplates(limit: number = 6): Template[] {
    return this.getAllTemplates()
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  /**
   * 获取最新模板
   */
  getLatestTemplates(limit: number = 6): Template[] {
    return this.getAllTemplates()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * 根据难度获取模板
   */
  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Template[] {
    return this.getAllTemplates().filter(t => t.difficulty === difficulty);
  }

  /**
   * 应用模板到项目
   */
  applyTemplate(templateId: string, customizations?: any): any {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`模板 ${templateId} 不存在`);
    }

    // 克隆模板规格
    const spec = JSON.parse(JSON.stringify(template.specification));

    // 应用自定义配置
    if (customizations) {
      spec.designPreferences = {
        ...spec.designPreferences,
        ...customizations.designPreferences,
      };

      if (customizations.projectName) {
        spec.projectName = customizations.projectName;
      }

      if (customizations.features) {
        // 根据用户选择启用/禁用功能
        spec.features = spec.features.filter((f: any) => 
          customizations.features.includes(f.id)
        );
      }
    }

    return spec;
  }

  /**
   * 克隆并自定义模板
   */
  customizeTemplate(templateId: string, customizations: any): Template {
    const original = this.getTemplateById(templateId);
    if (!original) {
      throw new Error(`模板 ${templateId} 不存在`);
    }

    return {
      ...original,
      id: `custom-${Date.now()}`,
      name: customizations.name || `${original.name} (自定义)`,
      specification: this.applyTemplate(templateId, customizations),
      isCustom: true,
    };
  }
}
