import { ConflictException, Injectable } from '@nestjs/common';
import { Artist, CreateArtistDto } from '@music-match/entities';
import { UpdateArtistDto } from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const artistAlreadyExists = await this.artistRepository.findOneBy({
      name: createArtistDto.name,
    });

    if (artistAlreadyExists) {
      throw new ConflictException();
    }

    const artist = this.artistRepository.create(createArtistDto);
    return await this.artistRepository.save(artist);
  }

  async findAll() {
    return await this.artistRepository.find();
  }

  async findOne(id: number) {
    return await this.artistRepository.findOne({
      where: { id },
      relations: { releases: true },
    });
  }

  async update(id: number, updateArtistDto: UpdateArtistDto) {
    await this.artistRepository.update(id, updateArtistDto);
    return await this.artistRepository.findOne({
      where: { id },
      relations: { releases: true },
    });
  }

  async remove(id: number) {
    return await this.artistRepository.delete(id);
  }
}
