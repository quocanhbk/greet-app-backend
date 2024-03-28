import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class Block {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  blockerId: string

  @ManyToOne(() => User, user => user.blockedUsers, { onDelete: "CASCADE" })
  blocker: User

  @Column()
  blockedId: string

  @ManyToOne(() => User, user => user.blockedByUsers, { onDelete: "CASCADE" })
  blocked: User

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string
}
