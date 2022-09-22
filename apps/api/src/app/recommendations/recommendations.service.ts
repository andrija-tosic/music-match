import {
  Artist,
  Genre,
  RecommendationsDto,
  Release,
  User,
} from '@music-match/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async forUser(user: User): Promise<RecommendationsDto> {
    const userFromDb = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        likedTracks: { release: { genres: true } },
        following: { likedTracks: { release: { genres: true } } },
      },
    });

    const usersLikedGenresSet = new Set<Genre>();
    userFromDb.likedTracks.forEach((track) => {
      track.release.genres.forEach((genre) => usersLikedGenresSet.add(genre));
    });

    const usersLikedGenresArray = Array.from(usersLikedGenresSet.values());

    const takeAmount = 10;

    const artistsBasedOnGenres = await this.artistRepository.find({
      where: {
        releases: {
          genres: {
            type: In(usersLikedGenresArray.map(({ type }) => type)),
          },
        },
      },
      take: takeAmount,
    });

    const releasesBasedOnGenres = await this.releaseRepository.find({
      where: {
        genres: {
          type: In(usersLikedGenresArray.map(({ type }) => type)),
        },
      },
      take: takeAmount,
    });

    const friends = userFromDb.following;
    const friendsLikedGenresSet = new Set<Genre>();

    friends.forEach((friend) => {
      friend.likedTracks.forEach((track) => {
        track.release.genres.forEach((genre) =>
          friendsLikedGenresSet.add(genre)
        );
      });
    });

    const friendsLikedGenresArray = Array.from(usersLikedGenresSet.values());

    const artistsFromFriends = await this.artistRepository.find({
      where: {
        releases: {
          genres: {
            type: In(friendsLikedGenresArray.map(({ type }) => type)),
          },
        },
      },
      take: takeAmount,
    });

    const releasesFromFriends = await this.releaseRepository.find({
      where: {
        genres: {
          type: In(friendsLikedGenresArray.map(({ type }) => type)),
        },
      },
      take: takeAmount,
    });

    const newUsersBasedOnGenres = await this.userRepository.find({
      where: {
        id: Not(In([user.id, ...friends.map(({ id }) => id)])),
        likedTracks: {
          release: {
            genres: {
              type: In(usersLikedGenresArray.map(({ type }) => type)),
            },
          },
        },
      },
    });

    return {
      artistsBasedOnGenres,
      releasesBasedOnGenres,
      artistsFromFriends,
      releasesFromFriends,
      newUsersBasedOnGenres,
    };
  }
}
