import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Release } from '../release/release.entity';

@Entity()
export class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  imageUrl: string;

  @ManyToMany(() => Release, (release) => release.artists)
  @JoinTable()
  releases: Release[];
}
