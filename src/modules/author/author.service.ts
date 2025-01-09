import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBy, Author } from '../../database/entities/author.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegiserDto } from '../auth/dtos/register.dto';
import { UpdateAuthorDto } from './dtos/updateAuthor.dto';
import { TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author) private readonly authorRepo: Repository<Author>,
  ) {}

  async create(registerDto: RegiserDto) {
    return this.authorRepo.save(registerDto);
  }

  async update(authorId: string, updateAuthorDto: UpdateAuthorDto) {
    return this.authorRepo.update(authorId, updateAuthorDto);
  }

  async getByEmail(email: string) {
    return this.authorRepo.findOneBy({ email });
  }

  async getByUsername(username: string) {
    return this.authorRepo.findOneBy({ username });
  }

  async getById(id: string) {
    return this.authorRepo.findOneBy({ id });
  }

  async getAuthorByIdJoinStartup(id: string){
    return this.authorRepo.findOne({
      where: {id },
      relations: {
        startups: true
      }
    })
  }

  async removeRefreshToken(authorId: string) {
    return this.authorRepo.update(authorId, {
      currentHashedRefreshToken: null,
    });
  }

  async createWithGoogle(userData: TokenPayload) {
    return this.authorRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.GOOGLE,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, authorId: string) {
    const author: Author = await this.getById(authorId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      author.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return author;
    }
  }
}
