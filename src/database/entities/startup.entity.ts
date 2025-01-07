import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";
import { Image } from "./image.entity";
import { Author } from "./author.entity";

@Entity()
export class StartUp extends BaseEntity{
  @Column()
  title: string

  @Column({default: 0})
  views: number

  @Column({type: 'text'})
  description: string

  @Column()
  category: string

  @Column({type: 'text'})
  pitch: string

  @Column()
  imageId: string

  @Column()
  authorId: string

  @OneToOne(()=> Image, {eager: true} )
  @JoinColumn()
  image: Image

  @ManyToOne(()=> Author, {eager: true})
  author: Author
}