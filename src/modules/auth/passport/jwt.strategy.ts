import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthorService } from '../../author/author.service';
import { plainToInstance } from 'class-transformer';
import { Author, IAuthPayload } from 'src/database/entities/author.entity';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authorService: AuthorService,
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      
    });
  }

  async validate(payload: IAuthPayload) {
    
    const user: Author = await plainToInstance(
      Author,
      await this.authorService.getById(payload.authorId),
    );
    return user;
  }
}
