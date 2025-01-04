import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/baseEntity";

@Entity()
export class PlayList extends BaseEntity{
  @Column()
  title: string

  @Column({array: true, type: 'varchar', default: []})
  select: string[]
}