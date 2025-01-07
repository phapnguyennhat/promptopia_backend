import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StartUp } from 'src/database/entities/startup.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateStartup } from './dtos/createStartup.dto';
import { UpdateStartupDto } from './dtos/updateStartup.dto';

@Injectable()
export class StartupService {
  constructor(
    @InjectRepository(StartUp)
    private readonly startUpRepo: Repository<StartUp>,
  ) {}

  create(createStartup: CreateStartup, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.save(StartUp, createStartup);
    }
    return this.startUpRepo.save(createStartup);
  }

  async update(id: string, upstartStartupDto: UpdateStartupDto){
    return  this.startUpRepo.update(id, upstartStartupDto)
  }

  async search(query?: string) {
    if (!query) {
      return this.startUpRepo.find();
    }

    return this.startUpRepo
      .createQueryBuilder('startup')
      .leftJoinAndSelect('startup.author', 'author')
      .leftJoinAndSelect('startup.image', 'image')
      .where('startup.category LIKE :query', { query: `%${query}%` })
      .orWhere('startup.title LIKE :query', { query: `%${query}%` })
      .orWhere('author.name LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getStartupById(id: string) {
    return this.startUpRepo
      .createQueryBuilder('startup')
      .where('"startup"."id" = :id', { id })
      .leftJoin('startup.author', 'author')
      .leftJoin('author.avatar', 'avatar')
      .leftJoin('startup.image', 'image')
      .select([
        'startup',
        'author.id',
        'author.name',
        'author.username',
        'author.bio',
        'avatar.url',
        'image.url'
      ])
      .getOne();
  }
}
