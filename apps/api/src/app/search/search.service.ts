import {
  Artist,
  Release,
  Track,
  User,
  Playlist,
  SearchResultsDto,
} from '@music-match/entities';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    @InjectRepository(Release)
    private releaseRepository: Repository<Release>,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>
  ) {}

  async search(query: string, user: User) {
    query = query.trim();

    if (!query || query === '') {
      throw HttpStatus.NO_CONTENT;
    }

    Logger.log(query, 'Search query');

    const likeQuery = ILike(`%${query}%`);

    const queryOptions = { where: { name: likeQuery }, take: 5 };

    const [artists, releases, tracks, users, playlists, userFromDb] =
      await Promise.all([
        this.artistRepository.find(queryOptions),
        this.releaseRepository.find(queryOptions),
        this.trackRepository.find(queryOptions),
        this.userRepository.find(queryOptions),
        this.playlistRepository.find(queryOptions),
        this.userRepository.findOne({
          where: { id: user.id },
          relations: { likedTracks: true },
        }),
      ]);

    const searchResults: SearchResultsDto = {
      query,
      artists,
      releases,
      tracks: tracks.map((track) => {
        return {
          ...track,
          liked: userFromDb.likedTracks.map((t) => t.id).includes(track.id),
        };
      }),
      users,
      playlists,
    };

    return searchResults;
  }
}
