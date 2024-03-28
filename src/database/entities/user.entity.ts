import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { Block } from "./block.entity"
import { FriendRequest } from "./friend-request.entity"
import { Friendship } from "./friendship.entity"
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

  @Column({ default: 0 })
  exp: number

  @Column({ default: 1 })
  level: number

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: string

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: string

  @OneToMany(() => UserLanguage, userLanguage => userLanguage.user)
  userLanguages: UserLanguage[] | null

  @OneToOne(() => UserPreference, userPreference => userPreference.user)
  preference: UserPreference

  @OneToMany(() => UserTopic, userTopic => userTopic.user)
  userTopics: UserTopic[] | null

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.requester)
  sentFriendRequests: FriendRequest[] | null

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.requestee)
  receivedFriendRequests: FriendRequest[] | null

  @OneToMany(() => Friendship, friendship => friendship.user1)
  friendships1: Friendship[] | null

  @OneToMany(() => Friendship, friendship => friendship.user2)
  friendships2: Friendship[] | null

  @OneToMany(() => Block, block => block.blocker)
  blockedUsers: User[] | null

  @OneToMany(() => Block, block => block.blocked)
  blockedByUsers: User[] | null
}
