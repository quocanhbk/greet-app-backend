import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  requesterId: string

  @ManyToOne(() => User, user => user.sentFriendRequests)
  requester: User

  @Column()
  requesteeId: string

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  requestee: User

  @Column({ default: "pending" })
  status: string

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string
}
