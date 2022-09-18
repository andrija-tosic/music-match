import {
  AddTrackDto,
  ChangeTrackPositionDto,
  CreatePlaylistDto,
  Playlist,
  PlaylistDto,
  PlaylistTrack,
  RemoveTrackDto,
  Track,
  UpdatePlaylistDto,
  User,
} from '@music-match/entities';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(PlaylistTrack)
    private readonly ptRepository: Repository<PlaylistTrack>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
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

  async findOne(id: number, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: {
        owners: true,
        playlistTracks: { track: { release: { artists: true } } },
      },
    });

    if (!playlist) throw new NotFoundException();

    const tracksInPlaylist = playlist.playlistTracks
      .sort((pt1, pt2) => pt1.number - pt2.number)
      .map((pt) => pt.track);

    const userFromDb = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { likedPlaylists: true, likedTracks: true },
    });

    const playlistDto: PlaylistDto = {
      id: playlist.id,
      description: playlist.description,
      imageUrl: playlist.imageUrl,
      name: playlist.name,
      owners: playlist.owners,
      tracks: tracksInPlaylist.map((track) => {
        return {
          ...track,
          liked: userFromDb.likedTracks.map((t) => t.id).includes(track.id),
        };
      }),
      liked: userFromDb.likedPlaylists.map((p) => p.id).includes(playlist.id),
    };

    return playlistDto;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto, user: User) {
    await this.playlistRepository.update(id, updatePlaylistDto);
    return await this.findOne(id, user);
  }

  async remove(id: number) {
    return await this.playlistRepository.delete(id);
  }

  async addTrack(id: number, trackDto: AddTrackDto, user: User) {
    const playlist: Playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },
      relations: {
        playlistTracks: { track: { release: { artists: true } } },
        owners: true,
      },
    });

    if (!playlist.owners.map((owner) => owner.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const trackToAdd: Track = await this.trackRepository.findOneBy({
      id: trackDto.trackId,
    });

    const playlistTrackToCreate: Omit<PlaylistTrack, 'id'> = {
      number: playlist.playlistTracks.length + 1,
      addedByUser: user,
      playlist: playlist,
      track: trackToAdd,
    };

    const playlistTrackToAdd: PlaylistTrack = this.ptRepository.create(
      playlistTrackToCreate
    );

    await this.ptRepository.save(playlistTrackToAdd);

    const tracksToReturn = playlist.playlistTracks
      .map((pt) => pt.track)
      .concat([trackToAdd])
      .sort((pt1, pt2) => pt1.number - pt2.number);

    return tracksToReturn;
  }

  async removeTrack(id: number, trackDto: RemoveTrackDto, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: {
        playlistTracks: { track: { release: { artists: true } } },
        owners: true,
      },
    });

    // console.table(playlist.playlistTracks);

    if (!playlist) throw new NotFoundException();

    if (!playlist.owners.map((owner) => owner.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const playlistTrackToRemove = playlist.playlistTracks.find(
      (pt) => trackDto.number === pt.number
    );

    if (!playlistTrackToRemove) {
      throw new NotFoundException();
    }

    playlist.playlistTracks = playlist.playlistTracks.filter((pt) => {
      if (pt.number !== trackDto.number) {
        if (pt.number > trackDto.number) {
          pt.number--;
        }
        return pt;
      }
    });

    await this.ptRepository.delete(playlistTrackToRemove.id);
    await this.ptRepository.save(playlist.playlistTracks);

    const tracksToReturn = playlist.playlistTracks
      .map((pt) => pt.track)
      .sort((pt1, pt2) => pt1.number - pt2.number);

    // console.table(playlist.playlistTracks);

    return tracksToReturn;
  }

  async changeTrackPosition(
    id: number,
    trackPositionChange: ChangeTrackPositionDto,
    user: User
  ) {
    const fromPosition = trackPositionChange.fromIndex + 1;
    const toPosition = trackPositionChange.toIndex + 1;

    if (fromPosition === toPosition) return;

    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { playlistTracks: true },
    });

    if (!playlist) throw new NotFoundException();

    const playlistTracks = playlist.playlistTracks;

    const target = playlistTracks.find((pt) => pt.number === fromPosition);

    // console.table(playlistTracks.sort((p1, p2) => p1.number - p2.number));

    const delta = fromPosition < toPosition ? -1 : 1;

    const left = Math.min(fromPosition, toPosition);
    const right = Math.max(fromPosition, toPosition);

    if (fromPosition < 1 || toPosition > playlistTracks.length)
      throw new BadRequestException();

    const newPlaylistTracks = playlistTracks.map((pt) => {
      if (
        pt.number !== fromPosition &&
        pt.number >= left &&
        pt.number <= right
      ) {
        pt.number += delta;
      }

      return pt;
    });

    target.number = toPosition;

    // console.table(
    //   newPlaylistTracks.sort((pt1, pt2) => pt1.number - pt2.number)
    // );

    playlist.playlistTracks = newPlaylistTracks;

    await this.playlistRepository.save(playlist);
    await this.ptRepository.save(newPlaylistTracks);

    return;
  }

  async toggleLike(id: number, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { likedByUsers: true },
    });
    const userFromDb = await this.userRepository.findOneBy({ id: user.id });
    if (playlist.likedByUsers.map((u) => u.id).includes(user.id)) {
      playlist.likedByUsers.splice(playlist.likedByUsers.indexOf(userFromDb));
    } else {
      playlist.likedByUsers.push(userFromDb);
    }

    return await this.playlistRepository.save(playlist);
  }

  async addOwner(playlistId: number, newOwnerId: number, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: { owners: true },
    });

    if (!playlist.owners.map((user) => user.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const newOwner = await this.userRepository.findOneBy({ id: newOwnerId });

    if (!newOwner) {
      throw new NotFoundException();
    }

    playlist.owners.push(newOwner);

    return await this.playlistRepository.save(playlist);
  }

  async removeOwner(playlistId: number, ownerId: number, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: { owners: true },
    });

    if (!playlist.owners.map((user) => user.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    playlist.owners = playlist.owners.filter((user) => user.id !== ownerId);

    return await this.playlistRepository.save(playlist);
  }
}
