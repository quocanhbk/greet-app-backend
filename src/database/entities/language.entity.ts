import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { UserLanguage } from "./user-language.entity"

@Entity()
export class Language {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @OneToMany(() => UserLanguage, userLanguage => userLanguage.language)
  userLanguages: UserLanguage[]
}
