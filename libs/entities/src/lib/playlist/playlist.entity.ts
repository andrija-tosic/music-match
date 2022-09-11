import { PlaylistTrack } from './../playlist-track/playlist-track.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@music-match/entities';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToMany(() => User, (user) => user.playlists, { cascade: true })
  owners: User[];

  @ManyToMany(() => User, (user) => user.likedPlaylists, { cascade: true })
  likedByUsers: User[];

  @OneToMany(() => PlaylistTrack, (pt) => pt.playlist, { cascade: true })
  playlistTracks: PlaylistTrack[];
}
