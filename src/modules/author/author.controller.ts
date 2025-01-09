import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { StartupService } from '../startup/startup.service';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService, private readonly startupService: StartupService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req){
    return req.user
  }

  @Get(':id/startup')
  getStartupByAuthorId(@Param('id') id: string){
    return this.startupService.getByAuthorId(id)
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string){
    return this.authorService.getById(id)
  }


}
