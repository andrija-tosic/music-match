import { Playlist } from './../playlist/playlist.entity';
import { Track } from './../track/track.entity';
import { Roles } from './roles';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'passwordHash' })
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  role: Roles;

  @ManyToMany(() => Playlist)
  playlists: Playlist[];

  @ManyToMany(() => Track)
  @JoinTable()
  likedTracks: Track[];
}
