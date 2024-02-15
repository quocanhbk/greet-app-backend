import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { UserTopic } from "./user-topic.entity"

@Entity()
export class Topic {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => UserTopic, userTopic => userTopic.topic)
  userTopics: UserTopic[]
}
