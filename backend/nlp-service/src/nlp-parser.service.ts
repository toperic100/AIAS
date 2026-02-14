
// backend/nlp-service/src/nlp-parser.service.ts
import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';

export interface ParsedRequirement {
  appType: 'web' | 'mobile' | 'hybrid';
  category: string;
  features: Feature[];
  dataModels: DataModel[];
  uiComponents: UIComponent[];
  businessLogic: BusinessLogic[];
  integrations: Integration[];
  designPreferences: DesignPreference;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  complexity: number; // 1-10
}

interface DataModel {
  name: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    validation?: string;
  }>;
  relationships: Array<{
    type: 'oneToOne' | 'oneToMany' | 'manyToMany';
    target: string;
  }>;
}

interface UIComponent {
  type: string;
  properties: Record<string, any>;
  children?: UIComponent[];
}

interface BusinessLogic {
  trigger: string;
  actions: string[];
  conditions?: string[];
}

interface Integration {
  service: string;
  purpose: string;
  apiKey?: string;
}

interface DesignPreference {
  theme: 'light' | 'dark' | 'auto';
  colorScheme: string;
  layout: string;
  responsive: boolean;
}

@Injectable()
export class NLPParserService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * 解析用户自然语言需求为结构化规格
   */
  async parseUserRequirement(userInput: string, conversationHistory: any[] = []): Promise<ParsedRequirement> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(userInput);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        ...conversationHistory,
        { role: 'user', content: userPrompt }
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return this.extractStructuredData(content.text);
  }

  /**
   * 多轮对话补全需求
   */
  async clarifyRequirement(
    currentSpec: Partial<ParsedRequirement>,
    userResponse: string,
    conversationHistory: any[]
  ): Promise<{ updatedSpec: ParsedRequirement; needsMoreInfo: boolean; nextQuestion?: string }> {
    const prompt = this.buildClarificationPrompt(currentSpec, userResponse);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        ...conversationHistory,
        { role: 'user', content: prompt }
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return this.parseClarificationResponse(content.text, currentSpec);
  }

  /**
   * 构建系统提示
   */
  private buildSystemPrompt(): string {
    return `你是一个专业的应用需求分析师,负责将用户的自然语言描述转换为结构化的应用规格。

你的任务:
1. 理解用户想要构建什么类型的应用
2. 识别核心功能和特性
3. 提取数据模型和关系
4. 分析UI组件需求
5. 理解业务逻辑
6. 识别第三方集成需求
7. 了解设计偏好

输出格式为JSON,包含以下字段:
{
  "appType": "web | mobile | hybrid",
  "category": "应用类别(如电商、社交、工具等)",
  "features": [
    {
      "id": "唯一标识",
      "name": "功能名称",
      "description": "详细描述",
      "priority": "high | medium | low",
      "complexity": 1-10
    }
  ],
  "dataModels": [
    {
      "name": "模型名称",
      "fields": [
        {
          "name": "字段名",
          "type": "数据类型",
          "required": true/false,
          "validation": "验证规则"
        }
      ],
      "relationships": [
        {
          "type": "关系类型",
          "target": "关联模型"
        }
      ]
    }
  ],
  "uiComponents": [
    {
      "type": "组件类型",
      "properties": {},
      "children": []
    }
  ],
  "businessLogic": [
    {
      "trigger": "触发条件",
      "actions": ["执行动作"],
      "conditions": ["前置条件"]
    }
  ],
  "integrations": [
    {
      "service": "服务名称",
      "purpose": "集成目的"
    }
  ],
  "designPreferences": {
    "theme": "light | dark | auto",
    "colorScheme": "配色方案",
    "layout": "布局风格",
    "responsive": true/false
  }
}

重要原则:
- 从用户描述中提取尽可能多的信息
- 对模糊的地方做合理推断
- 标记需要进一步确认的部分
- 保持结构化和可执行性`;
  }

  /**
   * 构建用户提示
   */
  private buildUserPrompt(userInput: string): string {
    return `用户需求描述:
${userInput}

请分析以上需求,输出结构化的应用规格JSON。
如果某些信息不明确,请基于常见场景做合理推断,并在响应中标注需要确认的点。`;
  }

  /**
   * 构建补全提示
   */
  private buildClarificationPrompt(currentSpec: Partial<ParsedRequirement>, userResponse: string): string {
    return `当前应用规格:
${JSON.stringify(currentSpec, null, 2)}

用户补充信息:
${userResponse}

请更新应用规格,合并新信息。如果仍有不明确的地方,生成下一个问题。

输出JSON格式:
{
  "updatedSpec": { ... },
  "needsMoreInfo": true/false,
  "nextQuestion": "下一个要问的问题(如果需要)"
}`;
  }

  /**
   * 从AI响应中提取结构化数据
   */
  private extractStructuredData(aiResponse: string): ParsedRequirement {
    // 提取JSON部分
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('无法从AI响应中提取JSON数据');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    // 验证和规范化数据
    return this.normalizeSpec(parsed);
  }

  /**
   * 解析补全响应
   */
  private parseClarificationResponse(
    aiResponse: string,
    currentSpec: Partial<ParsedRequirement>
  ): { updatedSpec: ParsedRequirement; needsMoreInfo: boolean; nextQuestion?: string } {
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('无法从AI响应中提取JSON数据');
    }

    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);

    return {
      updatedSpec: this.normalizeSpec(parsed.updatedSpec),
      needsMoreInfo: parsed.needsMoreInfo,
      nextQuestion: parsed.nextQuestion,
    };
  }

  /**
   * 规范化规格数据
   */
  private normalizeSpec(spec: any): ParsedRequirement {
    return {
      appType: spec.appType || 'web',
      category: spec.category || 'general',
      features: (spec.features || []).map((f: any, index: number) => ({
        id: f.id || `feature_${index}`,
        name: f.name,
        description: f.description,
        priority: f.priority || 'medium',
        complexity: f.complexity || 5,
      })),
      dataModels: spec.dataModels || [],
      uiComponents: spec.uiComponents || [],
      businessLogic: spec.businessLogic || [],
      integrations: spec.integrations || [],
      designPreferences: {
        theme: spec.designPreferences?.theme || 'light',
        colorScheme: spec.designPreferences?.colorScheme || 'blue',
        layout: spec.designPreferences?.layout || 'modern',
        responsive: spec.designPreferences?.responsive !== false,
      },
    };
  }

  /**
   * 生成引导性问题
   */
  async generateGuidingQuestions(partialSpec: Partial<ParsedRequirement>): Promise<string[]> {
    const prompt = `基于以下部分应用规格,生成3-5个引导性问题,帮助完善需求:

${JSON.stringify(partialSpec, null, 2)}

要求:
- 问题要具体、有针对性
- 避免太技术化
- 帮助明确核心功能和用户体验
- 输出JSON数组格式: ["问题1", "问题2", ...]`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  }
}