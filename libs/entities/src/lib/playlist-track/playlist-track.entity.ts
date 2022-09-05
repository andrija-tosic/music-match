import { User } from './../user/user.entity';
import { Track } from './../track/track.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';

@Entity()
export class PlaylistTrack {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @ManyToOne(() => User)
  addedByUser: User;

  @ManyToOne(() => Track, (track) => track.playlistTracks, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  track: Track;

  @ManyToOne(() => Playlist, (playlists) => playlists.playlistTracks, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  playlist: Playlist;
}
