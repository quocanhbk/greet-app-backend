import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { UserLanguage } from "./user-language.entity"
import { UserPreference } from "./user-preference.entity"
import { UserTopic } from "./user-topic.entity"

export enum UserGender {
  Male = "Male",
  Female = "Female",
  Unknown = "Unknown",
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ default: "" })
  email: string

  @Column({ default: "" })
  photo: string

  @Column({ default: "" })
  phoneNumber: string

  @Column({ default: "" })
  introduction: string

  @Column({ type: "timestamptz", nullable: true })
  dateOfBirth: string

  @Column({ nullable: true })
  gender: UserGender

  @OneToMany(() => UserLanguage, userLanguage => userLanguage.user)
  userLanguages: UserLanguage[] | null

  @OneToOne(() => UserPreference, userPreference => userPreference.user)
  preference: UserPreference

  @OneToMany(() => UserTopic, userTopic => userTopic.user)
  userTopics: UserTopic[] | null

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string
}
