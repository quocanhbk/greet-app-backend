import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm"
import { Language } from "./language.entity"
import { User } from "./user.entity"

export enum UserLanguageType {
  Fluent = "Fluent",
  Learning = "Learning",
}

@Entity()
@Unique(["userId", "languageId"])
export class UserLanguage {
  @PrimaryColumn()
  id: string

  @Column()
  userId: string

  @ManyToOne(() => User, user => user.userLanguages)
  user: User

  @Column()
  languageId: string

  @ManyToOne(() => Language, language => language.userLanguages)
  language: Language

  @Column()
  proficiency: number

  @Column()
  type: UserLanguageType

  @CreateDateColumn()
  createdAt: string

  @UpdateDateColumn()
  updatedAt: string
}
