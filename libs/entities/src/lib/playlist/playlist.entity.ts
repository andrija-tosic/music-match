import { PlaylistTrack } from './../playlist-track/playlist-track.entity';
import {
    Column,
    Entity,
    JoinTable,
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

    @Column()
    description: string;

    @Column()
    imageUrl: string;

    @ManyToMany(() => User)
    @JoinTable()
    owners: User[];

    @OneToMany(() => PlaylistTrack, (pt) => pt.playlist)
    playlistTracks: PlaylistTrack[];
}
