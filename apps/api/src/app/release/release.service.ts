import { Injectable } from '@nestjs/common';
import { Artist, CreateReleaseDto, Genre, Release, Track, UpdateReleaseDto } from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ReleaseService {
  constructor(
    @InjectRepository(Release) private readonly releaseRepository: Repository<Release>,
    @InjectRepository(Artist) private readonly artistRepository: Repository<Artist>
  ) {}

  async create(createReleaseDto: CreateReleaseDto) {
    const release = this.releaseRepository.create(createReleaseDto);
    release.artists = await this.artistRepository.findBy({ id: In(createReleaseDto.artistIds) });
    return await this.releaseRepository.save(release);
  }

  async findAll() {
    return await this.releaseRepository.find();
  }

  async findOne(id: number) {
    return await this.releaseRepository.findOneBy({ id });
  }

  async update(id: number, updateReleaseDto: UpdateReleaseDto) {
    const release = this.releaseRepository.create(updateReleaseDto);

    release.id = id;
    release.artists = await this.artistRepository.findBy({ id: In(updateReleaseDto.artistIds) });
    console.log(release);
    await this.releaseRepository.save(release);
    return await this.releaseRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.releaseRepository.delete(id);
  }
}
