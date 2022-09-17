import {
  Artist,
  CreateArtistDto,
  UpdateArtistDto,
} from '@music-match/entities';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: { releases: true },
    });

    if (!artist) throw new NotFoundException();
    return artist;
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
