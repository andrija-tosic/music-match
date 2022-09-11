import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AddTracksDto,
  CreatePlaylistDto,
  Playlist,
  PlaylistDto,
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

  async create(createPlaylistDto: CreatePlaylistDto, user: User) {
    const playlist = this.playlistRepository.create({
      ...createPlaylistDto,
      owners: [user],
    });
    return await this.playlistRepository.save(playlist);
  }

  async findAll() {
    return await this.playlistRepository.find();
  }

  async findOne(id: number) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { owners: true, playlistTracks: { track: true } },
    });

    const tracks = await this.trackRepository.find({
      where: { id: In(playlist.playlistTracks.map((pt) => pt.track.id)) },
    });

    const playlistDto: PlaylistDto = {
      id: playlist.id,
      description: playlist.description,
      imageUrl: playlist.imageUrl,
      name: playlist.name,
      owners: playlist.owners,
      tracks,
    };

    return playlistDto;
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
      relations: { playlistTracks: true, owners: true },
    });

    if (!playlist.owners.map((owner) => owner.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const tracksToAdd: Track[] = await this.trackRepository.findBy({ id: In(addTracksDto.trackIds) });

    const playlistTracksToCreate = tracksToAdd.map<Omit<PlaylistTrack, 'id'>>((track, i) => {
      return {
        number: playlist.playlistTracks.length + i,
        addedByUser: user,
        playlist: playlist,
        track: track,
      };
    });

    const playlistTracksToAdd: PlaylistTrack[] = this.ptRepository.create(playlistTracksToCreate);

    return await this.ptRepository.save(playlistTracksToAdd);
  }

  async removeTracks(id: number, tracksDto: AddTracksDto, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { owners: true, playlistTracks: { track: true } },
    });

    if (!playlist.owners.map((owner) => owner.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const playlistTracksIdsToRemove = playlist.playlistTracks
      .filter((pt) => tracksDto.trackIds.includes(pt.track.id))
      .map((pt) => pt.id);

    return await this.ptRepository.delete(playlistTracksIdsToRemove);
  }
}
