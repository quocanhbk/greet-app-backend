import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm"
import { User } from "./user.entity"

@Entity()
export class UserPreference {
  @PrimaryColumn()
  userId: string

  @OneToOne(() => User, user => user.preference, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User

  @Column({ default: "" })
  partnerDescription: string

  @Column({ nullable: true })
  locationRange: number

  @Column({ default: 0 })
  ageRangeMin: number

  @Column({ default: 99 })
  ageRangeMax: number
}
