import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req){
    return req.user
  }
}
