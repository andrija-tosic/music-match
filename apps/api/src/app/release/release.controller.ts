import {
  CreateReleaseDto,
  Roles,
  UpdateReleaseDto,
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../decorators/role.decorator';
import { UserFromSession } from '../decorators/user.decorator';
import { SessionGuard } from '../auth/guards/session.guard';
import { ReleaseService } from './release.service';

@Controller('releases')
@UseInterceptors(ClassSerializerInterceptor)
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
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @UserFromSession() user: User
  ) {
    return this.releaseService.findOne(id, user);
  }

  @Patch(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReleaseDto: UpdateReleaseDto,
    @UserFromSession() user: User
  ) {
    return this.releaseService.update(id, updateReleaseDto, user);
  }

  @Delete(':id')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.releaseService.remove(id);
  }
}
