import {
  CreateReleaseDto,
  Roles,
  UpdateReleaseDto,
} from '@music-match/entities';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../decorators/role.decorator';
import { UserFromSession } from '../decorators/user.decorator';
import { SessionGuard } from './../auth/guards/session.guard';
import { ReleaseService } from './release.service';

@Controller('releases')
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  @Post()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  create(@Body() createReleaseDto: CreateReleaseDto) {
    return this.releaseService.create(createReleaseDto);
  }

  @Get()
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  findAll() {
    return this.releaseService.findAll();
  }

  @UseGuards(SessionGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @UserFromSession() user) {
    return this.releaseService.findOne(+id, user);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  update(@Param('id') id: string, @Body() updateReleaseDto: UpdateReleaseDto) {
    return this.releaseService.update(+id, updateReleaseDto);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  remove(@Param('id') id: string) {
    return this.releaseService.remove(+id);
  }
}
