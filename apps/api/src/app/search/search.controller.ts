import { SessionGuard } from './../auth/guards/session.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { UserFromSession } from '../decorators/user.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/:query')
  @UseGuards(SessionGuard)
  search(@Param('query') query: string, @UserFromSession() user) {
    return this.searchService.search(query, user);
  }
}
