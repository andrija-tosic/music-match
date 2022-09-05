import { Genre } from '../tag/tag.entity';
import { Track } from './../track/track.entity';
import { Artist } from './../artist/artist.entity';
import { ReleaseType } from './release-type';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Release {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  releaseDate: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: ReleaseType,
  })
  type: ReleaseType;

  @ManyToMany(() => Artist, { onDelete: 'CASCADE', cascade: true })
  artists: Artist[];

  @OneToMany(() => Track, (track) => track.release)
  tracks: Track[];

  @ManyToMany(() => Genre, (genre) => genre.releases)
  @JoinTable()
  genres: Genre[];
}
