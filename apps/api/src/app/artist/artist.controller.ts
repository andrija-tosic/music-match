import { CreateArtistDto, Roles, UpdateArtistDto } from '@music-match/entities';
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionGuard } from '../auth/guards/session.guard';
import { Role } from '../decorators/role.decorator';
import { ArtistService } from './artist.service';

@Controller('artists')
@UseInterceptors(ClassSerializerInterceptor)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArtistDto: UpdateArtistDto
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.remove(id);
  }
}
