import { PlaylistTrack } from './../playlist-track/playlist-track.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@music-match/entities';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '' })
  imageUrl: string;

  @ManyToMany(() => User, (user) => user.playlists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  owners: User[];

  @ManyToMany(() => User, (user) => user.likedPlaylists, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likedByUsers: User[];

  @OneToMany(() => PlaylistTrack, (pt) => pt.playlist)
  playlistTracks: PlaylistTrack[];
}
