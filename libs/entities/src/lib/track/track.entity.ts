import { User } from '@music-match/entities';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlaylistTrack } from './../playlist-track/playlist-track.entity';
import { Release } from './../release/release.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column()
  number: number;

  @Column()
  duration: number;

  @ManyToOne(() => Release, {
    onDelete: 'CASCADE',
    cascade: ['insert', 'update'],
  })
  release: Release;

  @OneToMany(() => PlaylistTrack, (pt) => pt.track)
  playlistTracks: PlaylistTrack[];

  @ManyToMany(() => User, (user) => user.likedTracks, { cascade: true })
  likedByUsers: User[];
}
