import { SessionGuard } from './../auth/guards/session.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from '@music-match/entities';
import { UserFromSession } from '../decorators/user.decorator';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    @Inject(UserService.name) private readonly userService: UserService
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getAbout(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get(':id/playlists')
  getUsersPlaylists(@Param('id') id: string) {
    return this.userService.getUsersPlaylists(+id);
  }

  @Put(':id/toggle-following')
  @UseGuards(SessionGuard)
  addFriend(@Param('id') friendId: string, @UserFromSession() user) {
    return this.userService.toggleFollowing(+friendId, user);
  }

  @Get(':id/music-match')
  @UseGuards(SessionGuard)
  calculateCompatibility(@Param('id') id: string, @UserFromSession() user) {
    return this.userService.calculateCompatibility(+id, user);
  }
}
