import { User } from '@music-match/entities';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { SessionGuard } from '../auth/guards/session.guard';
import { UserFromSession } from '../decorators/user.decorator';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Get()
  @UseGuards(SessionGuard)
  forUser(@UserFromSession() user: User) {
    return this.recommendationsService.forUser(user);
  }
}
