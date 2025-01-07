import { Injectable } from '@nestjs/common';
import { AuthorService } from '../author/author.service';
import * as bcrypt from 'bcrypt';
import { Author, IAuthPayload } from 'src/database/entities/author.entity'
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  constructor(private readonly authorService: AuthorService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

 

  async setCurrentRefreshToken(refreshToken: string, authorId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return this.authorService.update(authorId, {
      currentHashedRefreshToken,
    });
  }

  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async validateAuthor (account: string, password: string){
    let author: Author = null
    if(isEmail(account)){
      author = await this.authorService.getByEmail(account)
    }else{
      author = await this.authorService.getByUsername(account)
    }
    if(!author){
      return null
    }

    const isPasswordMatching = await bcrypt.compare(password, author.password);
    if (!isPasswordMatching) {
      return null;
    }
    return author;
  }

  async getCookieWithJwtAccessToken(authorId: string) {
    const author: Author = await this.authorService.getById(authorId);
    const payload: IAuthPayload = {
      authorId: author.id,
    };
    const token = this.jwtService.sign(payload);
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      token,
      accessTime: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      cookie,
    };
  }

  async getCookieWithJwtRefreshToken(authorId: string) {
     await this.authorService.getById(authorId);
    const payload: IAuthPayload = {
      authorId,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
    return {
      cookie,
      accessTime: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      token,
    };
  }
}
