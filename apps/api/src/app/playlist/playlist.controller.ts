import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { AddTracksDto, CreatePlaylistDto, UpdatePlaylistDto } from '@music-match/entities';
import { SessionGuard } from '../auth/guards/session.guard';
import { User } from '../decorators/user.decorator';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.create(createPlaylistDto);
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

  @Get('session')
  @UseGuards(SessionGuard)
  @Post(':id')
  addTracks(@Param('id') id: string, @Body() addTracksDto: AddTracksDto, @User() user) {
    return this.playlistService.addTracks(+id, addTracksDto, user);
  }
}
