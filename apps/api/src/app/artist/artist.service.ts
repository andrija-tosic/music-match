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
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private dataSource: DataSource
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
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.artistRepository.delete(id);

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
