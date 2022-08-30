import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User } from '@e-exam-workspace/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword } from '../utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto) {
    const userAlreadyExists = await this.findOneByUsername(createUserDto.username);

    if (userAlreadyExists) {
      return new ConflictException();
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}
