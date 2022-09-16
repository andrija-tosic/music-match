import { Playlist } from '../playlist/playlist.entity';
import { Track } from '../track/track.entity';
import { Roles } from './roles';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'passwordHash', select: false })
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ default: '' })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  role: Roles;

  @ManyToMany(() => Playlist, (playlist) => playlist.owners)
  @JoinTable()
  playlists: Playlist[];

  @ManyToMany(() => Playlist, (playlist) => playlist.likedByUsers)
  @JoinTable()
  likedPlaylists: Playlist[];

  @ManyToMany(() => Track, (track) => track.likedByUsers)
  @JoinTable()
  likedTracks: Track[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}
