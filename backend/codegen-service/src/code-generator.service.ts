
// backend/codegen-service/src/code-generator.service.ts
import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import * as prettier from 'prettier';

export interface GeneratedCode {
  projectStructure: ProjectStructure;
  files: GeneratedFile[];
  dependencies: Dependencies;
  configuration: Configuration;
}

interface ProjectStructure {
  type: 'react' | 'nextjs' | 'react-native' | 'vue';
  framework: string;
  buildTool: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

interface Dependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

interface Configuration {
  env: Record<string, string>;
  scripts: Record<string, string>;
  eslint?: any;
  tsconfig?: any;
}

@Injectable()
export class CodeGeneratorService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * 根据规格生成完整代码
   */
  async generateApplication(spec: any): Promise<GeneratedCode> {
    // 第一步: 生成项目结构和架构
    const architecture = await this.generateArchitecture(spec);

    // 第二步: 生成核心文件
    const coreFiles = await this.generateCoreFiles(spec, architecture);

    // 第三步: 生成数据层
    const dataFiles = await this.generateDataLayer(spec.dataModels);

    // 第四步: 生成UI组件
    const uiFiles = await this.generateUIComponents(spec.uiComponents, spec.designPreferences);

    // 第五步: 生成业务逻辑
    const logicFiles = await this.generateBusinessLogic(spec.businessLogic);

    // 第六步: 生成配置和依赖
    const config = await this.generateConfiguration(spec, architecture);

    // 合并所有文件
    const allFiles = [
      ...coreFiles,
      ...dataFiles,
      ...uiFiles,
      ...logicFiles,
    ];

    // 格式化代码
    const formattedFiles = await this.formatAllFiles(allFiles);

    return {
      projectStructure: architecture,
      files: formattedFiles,
      dependencies: config.dependencies,
      configuration: config.configuration,
    };
  }

  /**
   * 生成项目架构
   */
  private async generateArchitecture(spec: any): Promise<ProjectStructure> {
    const prompt = `基于以下应用规格,设计最佳的技术架构:

应用类型: ${spec.appType}
类别: ${spec.category}
功能数量: ${spec.features.length}
复杂度: ${this.calculateComplexity(spec)}

选择最合适的:
1. 前端框架 (React/Next.js/React Native/Vue)
2. 构建工具 (Vite/Webpack/Turbopack)
3. 状态管理方案
4. 路由方案
5. UI库推荐

输出JSON格式:
{
  "type": "框架类型",
  "framework": "具体框架和版本",
  "buildTool": "构建工具",
  "stateManagement": "状态管理",
  "routing": "路由方案",
  "uiLibrary": "UI库",
  "reasoning": "选择理由"
}`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const result = this.extractJSON(content.text);
    
    return {
      type: result.type,
      framework: result.framework,
      buildTool: result.buildTool,
    };
  }

  /**
   * 生成核心文件(App.tsx, main.tsx等)
   */
  private async generateCoreFiles(spec: any, architecture: ProjectStructure): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // 生成主入口文件
    const mainFile = await this.generateWithAI(`
生成 ${architecture.framework} 应用的主入口文件 (main.tsx/index.tsx)

要求:
- 使用 ${architecture.framework}
- 配置路由
- 配置状态管理
- 配置主题 (${spec.designPreferences.theme})
- 响应式设计: ${spec.designPreferences.responsive}

直接输出完整的TypeScript代码,不要解释。
`, 'typescript');

    files.push({
      path: 'src/main.tsx',
      content: mainFile,
      language: 'typescript',
      description: '应用主入口文件',
    });

    // 生成App组件
    const appFile = await this.generateWithAI(`
生成 App.tsx 根组件

功能:
${spec.features.map((f: any) => `- ${f.name}`).join('\n')}

要求:
- 设置路由结构
- 全局布局
- 主题配置
- 响应式布局

直接输出完整的React TypeScript代码。
`, 'typescript');

    files.push({
      path: 'src/App.tsx',
      content: appFile,
      language: 'typescript',
      description: '根组件',
    });

    return files;
  }

  /**
   * 生成数据层(Models, API, Store)
   */
  private async generateDataLayer(dataModels: any[]): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const model of dataModels) {
      // 生成TypeScript类型定义
      const typeFile = await this.generateWithAI(`
生成 ${model.name} 的TypeScript类型定义

字段:
${model.fields.map((f: any) => `- ${f.name}: ${f.type}${f.required ? ' (必填)' : ''}`).join('\n')}

关系:
${model.relationships?.map((r: any) => `- ${r.type} -> ${r.target}`).join('\n') || '无'}

要求:
- 使用TypeScript interface
- 添加JSDoc注释
- 包含验证规则
- 导出类型

直接输出代码。
`, 'typescript');

      files.push({
        path: `src/types/${model.name}.ts`,
        content: typeFile,
        language: 'typescript',
        description: `${model.name} 类型定义`,
      });

      // 生成API服务
      const apiFile = await this.generateWithAI(`
生成 ${model.name} 的API服务类

操作:
- create${model.name}
- get${model.name}
- update${model.name}
- delete${model.name}
- list${model.name}s

要求:
- 使用 axios 或 fetch
- 完整的错误处理
- TypeScript 类型安全
- 支持分页和过滤

直接输出代码。
`, 'typescript');

      files.push({
        path: `src/services/${model.name}Service.ts`,
        content: apiFile,
        language: 'typescript',
        description: `${model.name} API服务`,
      });

      // 生成Zustand Store
      const storeFile = await this.generateWithAI(`
生成 ${model.name} 的Zustand状态管理

状态:
- ${model.name.toLowerCase()}s: ${model.name}[]
- loading: boolean
- error: string | null

方法:
- fetch${model.name}s
- add${model.name}
- update${model.name}
- delete${model.name}

要求:
- 使用 zustand
- 集成 API 服务
- 乐观更新
- TypeScript 类型

直接输出代码。
`, 'typescript');

      files.push({
        path: `src/stores/${model.name.toLowerCase()}Store.ts`,
        content: storeFile,
        language: 'typescript',
        description: `${model.name} 状态管理`,
      });
    }

    return files;
  }

  /**
   * 生成UI组件
   */
  private async generateUIComponents(
    components: any[],
    designPreferences: any
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const component of components) {
      const componentCode = await this.generateWithAI(`
生成 ${component.type} React组件

属性:
${JSON.stringify(component.properties, null, 2)}

设计要求:
- 主题: ${designPreferences.theme}
- 配色: ${designPreferences.colorScheme}
- 布局: ${designPreferences.layout}
- 响应式: ${designPreferences.responsive}

技术栈:
- React + TypeScript
- TailwindCSS
- Shadcn/ui 组件
- 无障碍访问 (ARIA)

要求:
- 完整的Props类型定义
- 优秀的用户体验
- 性能优化
- 移动端友好

直接输出完整代码,包含样式。
`, 'typescript');

      files.push({
        path: `src/components/${component.type}.tsx`,
        content: componentCode,
        language: 'typescript',
        description: `${component.type} 组件`,
      });
    }

    // 生成通用UI组件库索引
    const indexContent = components.map(c => 
      `export { default as ${c.type} } from './${c.type}';`
    ).join('\n');

    files.push({
      path: 'src/components/index.ts',
      content: indexContent,
      language: 'typescript',
      description: '组件库索引',
    });

    return files;
  }

  /**
   * 生成业务逻辑
   */
  private async generateBusinessLogic(logics: any[]): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const logic of logics) {
      const logicCode = await this.generateWithAI(`
生成业务逻辑: ${logic.trigger}

触发条件: ${logic.trigger}
执行动作:
${logic.actions.map((a: string) => `- ${a}`).join('\n')}

前置条件:
${logic.conditions?.map((c: string) => `- ${c}`).join('\n') || '无'}

要求:
- 使用 React Hooks
- 完整的错误处理
- 加载状态管理
- 用户反馈
- TypeScript

直接输出代码。
`, 'typescript');

      const fileName = logic.trigger.replace(/\s+/g, '-').toLowerCase();
      files.push({
        path: `src/hooks/use${fileName}.ts`,
        content: logicCode,
        language: 'typescript',
        description: `业务逻辑: ${logic.trigger}`,
      });
    }

    return files;
  }

  /**
   * 生成配置文件
   */
  private async generateConfiguration(spec: any, architecture: ProjectStructure): Promise<{
    dependencies: Dependencies;
    configuration: Configuration;
  }> {
    // 基础依赖
    const baseDeps: Record<string, string> = {
      'react': '^18.3.0',
      'react-dom': '^18.3.0',
    };

    const baseDevDeps: Record<string, string> = {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      'typescript': '^5.5.0',
      'vite': '^5.4.0',
      '@vitejs/plugin-react': '^4.3.0',
    };

    // 根据架构添加依赖
    if (architecture.framework.includes('Next')) {
      baseDeps['next'] = '^15.0.0';
    }

    // 状态管理
    baseDeps['zustand'] = '^5.0.0';

    // UI库
    baseDeps['tailwindcss'] = '^3.4.0';
    baseDevDeps['@tailwindcss/forms'] = '^0.5.0';
    baseDevDeps['autoprefixer'] = '^10.4.0';
    baseDevDeps['postcss'] = '^8.4.0';

    // API客户端
    baseDeps['axios'] = '^1.7.0';
    baseDeps['@tanstack/react-query'] = '^5.56.0';

    // 路由
    baseDeps['react-router-dom'] = '^6.26.0';

    // 工具库
    baseDeps['date-fns'] = '^4.1.0';
    baseDeps['zod'] = '^3.23.0';

    // 基础配置
    const scripts = {
      'dev': 'vite',
      'build': 'tsc && vite build',
      'preview': 'vite preview',
      'lint': 'eslint . --ext ts,tsx',
      'format': 'prettier --write "src/**/*.{ts,tsx}"',
    };

    const env = {
      VITE_API_URL: 'http://localhost:3000/api',
    };

    return {
      dependencies: {
        dependencies: baseDeps,
        devDependencies: baseDevDeps,
      },
      configuration: {
        env,
        scripts,
      },
    };
  }

  /**
   * 使用AI生成代码
   */
  private async generateWithAI(prompt: string, language: string): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // 提取代码块
    const codeMatch = content.text.match(/```(?:typescript|tsx|ts|javascript|jsx|js)?\n([\s\S]*?)\n```/);
    return codeMatch ? codeMatch[1] : content.text;
  }

  /**
   * 格式化所有文件
   */
  private async formatAllFiles(files: GeneratedFile[]): Promise<GeneratedFile[]> {
    const formatted: GeneratedFile[] = [];

    for (const file of files) {
      try {
        let formattedContent = file.content;

        if (file.language === 'typescript' || file.language === 'javascript') {
          formattedContent = await prettier.format(file.content, {
            parser: 'typescript',
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
            tabWidth: 2,
          });
        }

        formatted.push({
          ...file,
          content: formattedContent,
        });
      } catch (error) {
        // 格式化失败,使用原始内容
        formatted.push(file);
      }
    }

    return formatted;
  }

  /**
   * 计算应用复杂度
   */
  private calculateComplexity(spec: any): number {
    let complexity = 0;
    
    complexity += spec.features.reduce((sum: number, f: any) => sum + f.complexity, 0);
    complexity += spec.dataModels.length * 2;
    complexity += spec.integrations.length * 3;
    
    return complexity;
  }

  /**
   * 从AI响应中提取JSON
   */
  private extractJSON(text: string): any {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('无法从响应中提取JSON');
    }

    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  }
}