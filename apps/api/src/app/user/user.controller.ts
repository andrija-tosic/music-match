import { SessionGuard } from './../auth/guards/session.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getAbout(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get(':id/playlists')
  getUsersPlaylists(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUsersPlaylists(id);
  }

  @Put(':id/toggle-following')
  @UseGuards(SessionGuard)
  addFriend(
    @Param('id', ParseIntPipe) id: number,
    @Param('id', ParseIntPipe) friendId: number,
    @UserFromSession() user
  ) {
    return this.userService.toggleFollowing(+friendId, user);
  }

  @Get(':id/music-match')
  @UseGuards(SessionGuard)
  calculateCompatibility(
    @Param('id', ParseIntPipe) id: number,
    @UserFromSession() user
  ) {
    return this.userService.calculateCompatibility(id, user);
  }
}
