import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";

@Entity()
export class Image extends BaseEntity {
  @Column()
  url: string

  @Column()
  key: string
}