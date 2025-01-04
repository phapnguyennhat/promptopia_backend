import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";
import { Image } from "./image.entity";
import { Author } from "./author.entity";

@Entity()
export class StartUp extends BaseEntity{
  @Column()
  title: string

  @Column()
  views: number

  @Column({type: 'text'})
  desciptions: string

  @Column()
  category: string

  @Column()
  imageId: string

  @Column()
  authorId: string

  @OneToOne(()=> Image )
  image: Image

  @ManyToOne(()=> Author)
  author: Author
}