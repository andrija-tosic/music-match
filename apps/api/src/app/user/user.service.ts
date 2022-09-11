import { Playlist } from './../../../../../libs/entities/src/lib/playlist/playlist.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from '@music-match/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Playlist) private readonly playlistRepository: Repository<Playlist>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.userRepository.findOneBy({ username: createUserDto.username });

    if (userAlreadyExists) {
      throw new ConflictException();
    }

    const password = await hashPassword(createUserDto.password);
    const user = this.userRepository.create({ ...createUserDto, password });
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async getUsersPlaylists(id: number) {
    const { playlists, likedPlaylists } = await this.userRepository.findOne({
      where: { id },
      relations: { playlists: true, likedPlaylists: true },
    });

    return { playlists, likedPlaylists };
  }
}
