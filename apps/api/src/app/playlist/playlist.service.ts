import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AddTrackDto,
  CreatePlaylistDto,
  Playlist,
  PlaylistDto,
  PlaylistTrack,
  RemoveTrackDto,
  Track,
  UpdatePlaylistDto,
  User,
} from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

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

    const tracksInPlaylist = playlist.playlistTracks.map((pt) => {
      return { ...pt.track, number: pt.number };
    });

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
      relations: { playlistTracks: { track: { release: true } }, owners: true },
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
      .map((pt) => {
        return { ...pt.track, number: pt.number };
      })
      .concat([{ ...trackToAdd, number: playlistTrackToAdd.number }]);

    return tracksToReturn;
  }

  async removeTrack(id: number, trackDto: RemoveTrackDto, user: User) {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: { playlistTracks: { track: { release: true } }, owners: true },
    });

    if (!playlist.owners.map((owner) => owner.id).includes(user.id)) {
      throw new UnauthorizedException();
    }

    const playlistTrackToRemove = playlist.playlistTracks.find(
      (pt) => trackDto.number === pt.number
    );

    if (!playlistTrackToRemove) {
      throw new NotFoundException();
    }

    playlist.playlistTracks = playlist.playlistTracks
      .filter((pt) => pt.number !== trackDto.number)
      .map((pt) => {
        if (pt.number > playlistTrackToRemove.number) {
          pt.number--;
        }

        return pt;
      });

    await this.playlistRepository.save(playlist);
    await this.ptRepository.delete(playlistTrackToRemove.id);

    const tracksToReturn = playlist.playlistTracks.map((pt) => {
      return { ...pt.track, number: pt.number };
    });

    return tracksToReturn;
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
