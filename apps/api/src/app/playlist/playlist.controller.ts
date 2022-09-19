import {
  AddTrackDto,
  ChangeTrackPositionDto,
  CreatePlaylistDto,
  RemoveTrackDto,
  UpdatePlaylistDto,
  User,
} from '@music-match/entities';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { UserFromSession } from '../decorators/user.decorator';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
@UseInterceptors(ClassSerializerInterceptor)
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(SessionGuard)
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @UserFromSession() user
  ) {
    return this.playlistService.create(createPlaylistDto, user);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  @UseGuards(SessionGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @UserFromSession() user) {
    return this.playlistService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @UserFromSession() user
  ) {
    return this.playlistService.update(id, updatePlaylistDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playlistService.remove(id);
  }

  @UseGuards(SessionGuard)
  @Post(':id/tracks')
  addTracks(
    @Param('id', ParseIntPipe) id: number,
    @Body() trackDto: AddTrackDto,
    @UserFromSession() user
  ) {
    return this.playlistService.addTrack(id, trackDto, user);
  }

  @UseGuards(SessionGuard)
  @Delete(':id/tracks')
  removeTracks(
    @Param('id', ParseIntPipe) id: number,
    @Body() trackDto: RemoveTrackDto,
    @UserFromSession() user
  ) {
    return this.playlistService.removeTrack(id, trackDto, user);
  }

  @Patch(':id/tracks/change-position')
  @UseGuards(SessionGuard)
  changeTrackPosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() trackPositionChange: ChangeTrackPositionDto,
    @UserFromSession() user: User
  ) {
    return this.playlistService.changeTrackPosition(
      id,
      trackPositionChange,
      user
    );
  }

  @UseGuards(SessionGuard)
  @Put(':id/toggle-like')
  toggleLike(@Param('id', ParseIntPipe) id: number, @UserFromSession() user) {
    return this.playlistService.toggleLike(id, user);
  }

  @UseGuards(SessionGuard)
  @Post(':id/owners/:ownerId')
  addOwner(
    @Param('id', ParseIntPipe) id: number,
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @UserFromSession() user
  ) {
    return this.playlistService.addOwner(id, ownerId, user);
  }

  @UseGuards(SessionGuard)
  @Delete(':id/owners/:ownerId')
  removeOwner(
    @Param('id', ParseIntPipe) id: number,
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @UserFromSession() user
  ) {
    return this.playlistService.removeOwner(id, ownerId, user);
  }
}
