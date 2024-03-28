import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity"

export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

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
  status: FriendRequestStatus

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string
}
