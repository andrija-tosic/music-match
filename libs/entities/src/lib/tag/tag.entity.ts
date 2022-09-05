import { GenreType } from './genre-type';
import { Release } from '@music-match/entities';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['type'])
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GenreType })
  type: GenreType;

  @ManyToMany(() => Release, (release) => release.genres)
  releases: Release[];
}
