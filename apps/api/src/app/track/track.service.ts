import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTrackDto, Track, UpdateTrackDto, Release } from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private readonly trackRepository: Repository<Track>,
    @InjectRepository(Release) private readonly releaseRepository: Repository<Release>
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const trackAlreadyExists = await this.trackRepository.findOneBy({ name: createTrackDto.name });

    if (trackAlreadyExists) {
      throw new ConflictException();
    }

    const releaseOfTrack = await this.releaseRepository.findOneBy({ id: createTrackDto.releaseId });

    const track = this.trackRepository.create(createTrackDto);
    track.release = releaseOfTrack;

    return await this.trackRepository.save(track);
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(id: number) {
    return await this.trackRepository.findOneBy({ id });
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    await this.trackRepository.update(id, updateTrackDto);
    return await this.trackRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.trackRepository.delete(id);
  }
}
