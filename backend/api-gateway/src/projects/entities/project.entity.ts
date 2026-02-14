
// backend/api-gateway/src/projects/entities/project.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['web', 'mobile', 'hybrid'],
    default: 'web',
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'generating', 'ready', 'deployed'],
    default: 'draft',
  })
  status: string;

  @Column({ nullable: true })
  specificationId: string;

  @Column({ nullable: true })
  generatedCodeId: string;

  @Column({ nullable: true })
  deploymentId: string;

  @Column({ type: 'int', default: 0 })
  fileCount: number;

  @Column({ type: 'int', nullable: true })
  progress: number;

  @Column({ nullable: true })
  currentStep: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}