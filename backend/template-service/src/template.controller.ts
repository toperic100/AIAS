
// backend/template-service/src/template.controller.ts
import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TemplateManagerService } from './template-manager.service';
import { Template, TemplateCategory } from './types/template.types';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateManagerService) {}

  /**
   * 获取所有模板
   */
  @Get()
  @ApiOperation({ summary: '获取所有模板' })
  @ApiResponse({ status: 200, description: '成功返回模板列表' })
  getAllTemplates(): Template[] {
    return this.templateService.getAllTemplates();
  }

  /**
   * 根据分类获取模板
   */
  @Get('category/:category')
  @ApiOperation({ summary: '根据分类获取模板' })
  @ApiResponse({ status: 200, description: '成功返回模板列表' })
  getTemplatesByCategory(
    @Param('category') category: TemplateCategory,
  ): Template[] {
    return this.templateService.getTemplatesByCategory(category);
  }

  /**
   * 根据难度获取模板
   */
  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: '根据难度获取模板' })
  @ApiResponse({ status: 200, description: '成功返回模板列表' })
  getTemplatesByDifficulty(
    @Param('difficulty') difficulty: 'beginner' | 'intermediate' | 'advanced',
  ): Template[] {
    return this.templateService.getTemplatesByDifficulty(difficulty);
  }

  /**
   * 搜索模板
   */
  @Get('search')
  @ApiOperation({ summary: '搜索模板' })
  @ApiQuery({ name: 'q', description: '搜索关键词' })
  @ApiResponse({ status: 200, description: '成功返回搜索结果' })
  searchTemplates(@Query('q') query: string): Template[] {
    return this.templateService.searchTemplates(query);
  }

  /**
   * 获取推荐模板
   */
  @Get('recommended')
  @ApiOperation({ summary: '获取推荐模板' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  @ApiResponse({ status: 200, description: '成功返回推荐模板' })
  getRecommendedTemplates(@Query('limit') limit?: number): Template[] {
    return this.templateService.getRecommendedTemplates(limit);
  }

  /**
   * 获取最新模板
   */
  @Get('latest')
  @ApiOperation({ summary: '获取最新模板' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  @ApiResponse({ status: 200, description: '成功返回最新模板' })
  getLatestTemplates(@Query('limit') limit?: number): Template[] {
    return this.templateService.getLatestTemplates(limit);
  }

  /**
   * 获取模板详情
   */
  @Get(':id')
  @ApiOperation({ summary: '获取模板详情' })
  @ApiResponse({ status: 200, description: '成功返回模板详情' })
  @ApiResponse({ status: 404, description: '模板不存在' })
  getTemplateById(@Param('id') id: string): Template {
    const template = this.templateService.getTemplateById(id);
    if (!template) {
      throw new Error(`模板 ${id} 不存在`);
    }
    return template;
  }

  /**
   * 应用模板
   */
  @Post(':id/apply')
  @ApiOperation({ summary: '应用模板到项目' })
  @ApiResponse({ status: 200, description: '成功应用模板' })
  applyTemplate(
    @Param('id') id: string,
    @Body() customizations?: any,
  ): any {
    return this.templateService.applyTemplate(id, customizations);
  }

  /**
   * 自定义模板
   */
  @Post(':id/customize')
  @ApiOperation({ summary: '自定义模板' })
  @ApiResponse({ status: 200, description: '成功创建自定义模板' })
  customizeTemplate(
    @Param('id') id: string,
    @Body() customizations: any,
  ): Template {
    return this.templateService.customizeTemplate(id, customizations);
  }
}