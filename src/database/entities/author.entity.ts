import { extend } from "joi";
import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";

@Entity()
export class Author extends BaseEntity {
 

  @Column()
  name: string

  @Column()
  username: string

  @Column({unique: true})
  email: string

  @Column()
  bio: string

  @Column()
  imageId: string

}