import { extend } from "joi";
import {  Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";
import { Exclude } from "class-transformer";
import { Image } from "./image.entity";


export enum AuthBy {
  GOOGLE='GOOGLE',
  GITHUB='GITHUB',
  LOCAL='LOCAL'
}

export interface IAuthPayload {
  authorId: string
}
@Entity()
export class Author extends BaseEntity {
 

  @Column()
  name: string

  @Column({ nullable: true})
  username: string

  @Column({nullable: true})
  @Exclude()
  password: string

  @Column({unique: true})
  email: string

  @Column({ nullable: true})
  bio: string

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken: string;

  @Column({nullable: true})
  avatarId: string

  @Column( {enum:AuthBy, type: 'enum', default: AuthBy.LOCAL})
  authBy: AuthBy

  @OneToOne(()=> Image, {nullable: true})
  @JoinColumn()
  avatar: Image
}