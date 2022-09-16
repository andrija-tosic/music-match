import { Genre } from '../genre/genre.entity';
import { Track } from './../track/track.entity';
import { Artist } from './../artist/artist.entity';
import { ReleaseType } from './release-type';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Release {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  releaseDate: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ReleaseType,
  })
  type: ReleaseType;

  @ManyToMany(() => Artist, (artist) => artist.releases, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  artists: Artist[];

  @OneToMany(() => Track, (track) => track.release, {
    cascade: ['insert', 'update'],
  })
  tracks: Track[];

  @ManyToMany(() => Genre, (genre) => genre.releases, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  genres: Genre[];
}
