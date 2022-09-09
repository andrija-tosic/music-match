import { User } from './../user/user.entity';
import { Track } from './../track/track.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';

@Entity()
export class PlaylistTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @ManyToOne(() => User)
  addedByUser: Relation<User>;

  @ManyToOne(() => Track, (track) => track.playlistTracks, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  track: Relation<Track>;

  @ManyToOne(() => Playlist, (playlists) => playlists.playlistTracks, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  playlist: Relation<Playlist>;
}
