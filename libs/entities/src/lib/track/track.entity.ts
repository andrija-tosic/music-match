import { Release } from './../release/release.entity';
import { PlaylistTrack } from './../playlist-track/playlist-track.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@music-match/entities';

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: number;

  @Column()
  duration: number;

  // @Column()
  // danceability: number;

  // @Column()
  // energy: number;

  // @Column()
  // key: number;

  // @Column()
  // loudness: number;

  // @Column()
  // mode: number;

  // @Column()
  // speechiness: number;

  // @Column()
  // acousticness: number;

  // @Column()
  // instrumentalness: number;

  // @Column()
  // liveness: number;

  // @Column()
  // valence: number;

  // @Column()
  // tempo: number;

  @ManyToOne(() => Release, { onDelete: 'CASCADE', cascade: true })
  release: Release;

  @OneToMany(() => PlaylistTrack, (pt) => pt.track)
  playlistTracks: PlaylistTrack[];

  @ManyToMany(() => User, (user) => user.likedTracks, { cascade: true })
  likedByUsers: User[];
}
