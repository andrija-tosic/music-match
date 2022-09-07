import { Injectable } from '@nestjs/common';
import {
  AddTracksDto,
  CreatePlaylistDto,
  Playlist,
  PlaylistTrack,
  Track,
  UpdatePlaylistDto,
  User,
} from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>,
    @InjectRepository(PlaylistTrack) private readonly ptRepository: Repository<PlaylistTrack>
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto) {
    const playlist = this.playlistRepository.create(createPlaylistDto);
    return await this.playlistRepository.save(playlist);
  }

  async findAll() {
    return await this.playlistRepository.find();
  }

  async findOne(id: number) {
    return await this.playlistRepository.findOneBy({ id });
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    await this.playlistRepository.update(id, updatePlaylistDto);
    return await this.playlistRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.playlistRepository.delete(id);
  }

  async addTracks(id: number, addTracksDto: AddTracksDto, user: User) {
    const playlist: Playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },
      relations: { playlistTracks: true },
    });

    // Shift all tracks by the number of tracks added.
    playlist.playlistTracks = playlist.playlistTracks.map((pt) => {
      if (pt.position >= addTracksDto.position) {
        pt.position += addTracksDto.trackIds.length;
      }

      return pt;
    });

    const tracksToAdd: Track[] = await this.trackRepository.findBy({ id: In(addTracksDto.trackIds) });

    const playlistTracksToCreate = tracksToAdd.map<Omit<PlaylistTrack, 'id'>>((track, i) => {
      return {
        position: addTracksDto.position + i,
        addedByUser: user,
        playlist: playlist,
        track: track,
      };
    });

    const playlistTracksToAdd: PlaylistTrack[] = this.ptRepository.create(playlistTracksToCreate);

    playlist.playlistTracks.push(...playlistTracksToAdd);

    await this.playlistRepository.save(playlist);
  }
}
