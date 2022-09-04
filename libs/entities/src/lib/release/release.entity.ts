import { Track } from './../track/track.entity';
import { Artist } from './../artist/artist.entity';
import { ReleaseType } from './release-type';
import {
  Column,
  Entity,
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

  @Column()
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ReleaseType,
    default: ReleaseType.Album,
  })
  type: ReleaseType;

  @ManyToMany(() => Artist, { onDelete: 'CASCADE' })
  artists: Artist[];

  @OneToMany(() => Track, (track) => track.release)
  tracks: Track[];
}
