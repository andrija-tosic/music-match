import { CreateTrackDto, Roles, UpdateTrackDto } from '@music-match/entities';
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
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionGuard } from '../auth/guards/session.guard';
import { Role } from '../decorators/role.decorator';
import { UserFromSession } from '../decorators/user.decorator';
import { TrackService } from './track.service';

@Controller('tracks')
@UseInterceptors(ClassSerializerInterceptor)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrackDto: UpdateTrackDto
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trackService.remove(id);
  }

  @UseGuards(SessionGuard)
  @Put(':id/toggle-like')
  toggleLike(@Param('id', ParseIntPipe) id: number, @UserFromSession() user) {
    return this.trackService.toggleLike(id, user);
  }
}
