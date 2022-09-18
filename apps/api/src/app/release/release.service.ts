import {
  Artist,
  CreateReleaseDto,
  Genre,
  Release,
  UpdateReleaseDto,
  User,
} from '@music-match/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ReleaseService {
  constructor(
    @InjectRepository(Release)
    private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>
  ) {}

  async create(createReleaseDto: CreateReleaseDto) {
    const release = this.releaseRepository.create(createReleaseDto);
    release.artists = await this.artistRepository.findBy({
      id: In(createReleaseDto.artistIds),
    });

    const genres = await this.genreRepository.findBy({
      type: In(createReleaseDto.genres.map(({ type }) => type)),
    });

    release.genres = genres;

    return await this.releaseRepository.save(release);
  }

  async findAll() {
    return await this.releaseRepository.find();
  }

  async findOne(id: number, user: User) {
    const releaseWithTracks = await this.releaseRepository.findOne({
      where: { id },
      relations: {
        tracks: { likedByUsers: true, release: { artists: true } },
        artists: true,
        genres: true,
      },
    });

    const tracksWithLikedAttribute = releaseWithTracks.tracks.map((track) => {
      return {
        ...track,
        liked: track.likedByUsers.map(({ id }) => id).includes(user.id),
      };
    });

    return {
      ...releaseWithTracks,
      tracks: tracksWithLikedAttribute,
    };
  }

  async update(id: number, updateReleaseDto: UpdateReleaseDto, user: User) {
    const release = this.releaseRepository.create(updateReleaseDto);

    release.id = id;
    release.artists = await this.artistRepository.findBy({
      id: In(updateReleaseDto.artistIds),
    });

    const existingGenres = await this.genreRepository.findBy({
      type: In(release.genres.map(({ type }) => type)),
    });

    const existingGenresMap = new Map<string, Genre>();

    existingGenres.forEach((genre) => existingGenresMap.set(genre.type, genre));

    const newGenres = release.genres.filter((genre) => {
      if (!existingGenresMap.has(genre.type)) return genre;
    });

    const newGenresFromDb = await this.genreRepository.create(newGenres);

    release.genres = [...existingGenres, ...newGenresFromDb];

    await this.releaseRepository.save(release);
    return await this.findOne(id, user);
  }

  async remove(id: number) {
    return await this.releaseRepository.delete(id);
  }
}
