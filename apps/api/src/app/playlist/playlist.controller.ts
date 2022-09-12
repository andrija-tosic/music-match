import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import {
  AddTrackDto,
  CreatePlaylistDto,
  RemoveTrackDto,
  UpdatePlaylistDto,
  User,
} from '@music-match/entities';
import { SessionGuard } from '../auth/guards/session.guard';
import { UserFromSession } from '../decorators/user.decorator';

@Controller('playlists')
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
  findOne(@Param('id') id: string, @UserFromSession() user) {
    return this.playlistService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
    @UserFromSession() user
  ) {
    return this.playlistService.update(+id, updatePlaylistDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }

  @UseGuards(SessionGuard)
  @Post(':id/tracks')
  addTracks(
    @Param('id') id: string,
    @Body() trackDto: AddTrackDto,
    @UserFromSession() user
  ) {
    return this.playlistService.addTrack(+id, trackDto, user);
  }

  @UseGuards(SessionGuard)
  @Delete(':id/tracks')
  removeTracks(
    @Param('id') id: string,
    @Body() trackDto: RemoveTrackDto,
    @UserFromSession() user
  ) {
    return this.playlistService.removeTrack(+id, trackDto, user);
  }

  @UseGuards(SessionGuard)
  @Put(':id/toggle-like')
  toggleLike(@Param('id') id: string, @UserFromSession() user) {
    return this.playlistService.toggleLike(+id, user);
  }

  @UseGuards(SessionGuard)
  @Post(':id/owners/:ownerId')
  addOwner(
    @Param('id') id: string,
    @Param('ownerId') ownerId: string,
    @UserFromSession() user
  ) {
    return this.playlistService.addOwner(+id, +ownerId, user);
  }

  @UseGuards(SessionGuard)
  @Delete(':id/owners/:ownerId')
  removeOwner(
    @Param('id') id: string,
    @Param('ownerId') ownerId: string,
    @UserFromSession() user
  ) {
    return this.playlistService.removeOwner(+id, +ownerId, user);
  }
}
