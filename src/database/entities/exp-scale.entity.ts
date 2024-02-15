import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class ExpScale {
  @PrimaryColumn({ type: "int" })
  level: number

  @Column({ default: 0 })
  exp: number

  @Column({ default: 0 })
  expGap: number

  @Column({ default: 0, type: "decimal" })
  expScale: number
}
