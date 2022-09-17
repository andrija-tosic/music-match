import { CreateTrackDto, Roles, UpdateTrackDto } from '@music-match/entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionGuard } from '../auth/guards/session.guard';
import { Role } from '../decorators/role.decorator';
import { UserFromSession } from '../decorators/user.decorator';
import { TrackService } from './track.service';

@Controller('tracks')
@UseGuards(SessionGuard)
@UseGuards(RolesGuard)
@Role(Roles.Admin)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return this.trackService.update(+id, updateTrackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackService.remove(+id);
  }

  @UseGuards(SessionGuard)
  @Put(':id/toggle-like')
  toggleLike(@Param('id') id: string, @UserFromSession() user) {
    return this.trackService.toggleLike(+id, user);
  }
}
