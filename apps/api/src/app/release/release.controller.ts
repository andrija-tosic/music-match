import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { CreateReleaseDto, UpdateReleaseDto } from '@music-match/entities';

@Controller('releases')
export class ReleaseController {
  constructor(private readonly releaseService: ReleaseService) {}

  @Post()
  create(@Body() createReleaseDto: CreateReleaseDto) {
    // Logger.log(createReleaseDto, 'CreateReleaseDto');
    return this.releaseService.create(createReleaseDto);
  }

  @Get()
  findAll() {
    return this.releaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.releaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReleaseDto: UpdateReleaseDto) {
    return this.releaseService.update(+id, updateReleaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.releaseService.remove(+id);
  }
}
