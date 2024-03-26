import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user1Id: string

  @ManyToOne(() => User, user => user.friendships1)
  user1: User

  @Column()
  user2Id: string

  @ManyToOne(() => User, user => user.friendships2)
  user2: User

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string
}
