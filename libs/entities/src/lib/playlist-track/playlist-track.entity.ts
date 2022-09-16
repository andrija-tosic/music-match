import { User } from './../user/user.entity';
import { Track } from './../track/track.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';

@Entity()
export class PlaylistTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @ManyToOne(() => User)
  addedByUser: Relation<User>;

  @ManyToOne(() => Track, (track) => track.playlistTracks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  track: Relation<Track>;

  @ManyToOne(() => Playlist, (playlists) => playlists.playlistTracks, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  playlist: Relation<Playlist>;
}
