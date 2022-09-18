import { Release } from '@music-match/entities';
import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GenreType } from './genre-type';

@Entity()
@Unique(['type'])
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: GenreType })
  type: GenreType;

  @ManyToMany(() => Release, (release) => release.genres, {
    cascade: ['insert', 'update'],
  })
  releases: Release[];
}
