
// backend/template-service/src/template.module.ts
import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateManagerService } from './template-manager.service';

@Module({
  controllers: [TemplateController],
  providers: [TemplateManagerService],
  exports: [TemplateManagerService],
})
export class TemplateModule {}