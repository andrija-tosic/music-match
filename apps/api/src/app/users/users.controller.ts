import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Inject, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from '@e-exam-workspace/entities';
import { LoginWithCredentialsGuard } from '../../auth/guards/local-auth.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(LoginWithCredentialsGuard)
export class UsersController {
  constructor(@Inject(UsersService.name) private readonly usersService: UsersService) { }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
