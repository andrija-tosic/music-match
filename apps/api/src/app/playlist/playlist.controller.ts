import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { AddTracksDto, CreatePlaylistDto, UpdatePlaylistDto } from '@music-match/entities';
import { SessionGuard } from '../auth/guards/session.guard';
import { User } from '../decorators/user.decorator';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(SessionGuard)
  create(@Body() createPlaylistDto: CreatePlaylistDto, @User() user) {
    return this.playlistService.create(createPlaylistDto, user);
  }

  @Get()
  findAll() {
    return this.playlistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistService.remove(+id);
  }

  @UseGuards(SessionGuard)
  @Post(':id/tracks')
  addTracks(@Param('id') id: string, @Body() tracksDto: AddTracksDto, @User() user) {
    return this.playlistService.addTracks(+id, tracksDto, user);
  }

  @UseGuards(SessionGuard)
  @Delete(':id/tracks')
  removeTracks(@Param('id') id: string, @Body() tracksDto: AddTracksDto, @User() user) {
    return this.playlistService.removeTracks(+id, tracksDto, user);
  }
}
