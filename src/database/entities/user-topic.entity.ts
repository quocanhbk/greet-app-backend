import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm"
import { Topic } from "./topic.entity"
import { User } from "./user.entity"

@Entity()
@Unique(["topicId", "userId"])
export class UserTopic {
  @PrimaryColumn()
  id: string

  @Column()
  topicId: string

  @ManyToOne(() => Topic, topic => topic.userTopics)
  topic: Topic

  @Column()
  userId: string

  @ManyToOne(() => User, user => user.userTopics)
  user: User
}
