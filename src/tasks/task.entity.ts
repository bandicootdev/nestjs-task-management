import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './tasks.model';
import { Auth } from '../auth/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Exclude()
  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => Auth, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: Auth;
}
