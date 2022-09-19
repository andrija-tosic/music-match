import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Release } from '../release/release.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column({ default: '' })
  imageUrl: string;

  @ManyToMany(() => Release, (release) => release.artists)
  @JoinTable()
  releases: Release[];
}
