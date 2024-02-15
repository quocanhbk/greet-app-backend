import { User, UserLanguage, UserPreference, UserTopic } from "@/database/entities"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { EntityManager, Repository } from "typeorm"
import { GetUserResponseDto, OnboardUserDto } from "./users.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private entityManager: EntityManager
  ) {}

  public async getUserInfo(userId: string): Promise<GetUserResponseDto> {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userLanguages", "userLanguages")
      .leftJoinAndSelect("userLanguages.language", "language")
      .leftJoinAndSelect("user.preference", "preference")
      .leftJoinAndSelect("user.userTopics", "userTopics")
      .leftJoinAndSelect("userTopics.topic", "topic")
      .where("user.id = :userId", { userId })
      .getOne()

    if (!user) throw new NotFoundException("User not found")

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      phoneNumber: user.phoneNumber,
      introduction: user.introduction,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      languages:
        user.userLanguages?.map(language => ({
          id: language.id,
          name: language.language.name,
          proficiency: language.proficiency,
          type: language.type,
        })) ?? [],
      topics:
        user.userTopics?.map(userTopic => ({
          id: userTopic.topic.id,
          name: userTopic.topic.name,
        })) ?? [],
      preference: user.preference
        ? {
            partnerDescription: user.preference.partnerDescription,
            locationRange: user.preference.locationRange,
            ageRangeMin: user.preference.ageRangeMin,
            ageRangeMax: user.preference.ageRangeMax,
          }
        : null,
    }
  }

  public async onboardUser(userId: string, dto: OnboardUserDto) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ["preference"] })

    if (!user) throw new NotFoundException("User not found")
    if (user.preference) throw new BadRequestException("User already onboarded")

    await this.entityManager.transaction(async manager => {
      await manager
        .createQueryBuilder(User, "user")
        .update()
        .set({
          name: dto.name,
          photo: dto.photo,
          introduction: dto.introduction,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
        })
        .execute()

      await manager
        .createQueryBuilder(UserPreference, "preference")
        .insert()
        .values({
          userId,
          partnerDescription: dto.preference.partnerDescription,
          locationRange: dto.preference.locationRange,
          ageRangeMin: dto.preference.ageRangeMin,
          ageRangeMax: dto.preference.ageRangeMax,
        })
        .execute()

      await manager
        .createQueryBuilder(UserLanguage, "userLanguage")
        .insert()
        .values(
          dto.languages.map(language => ({
            id: `${userId}-${language.id}`,
            userId,
            languageId: language.id,
            proficiency: language.proficiency,
            type: language.type,
          }))
        )
        .execute()

      await manager
        .createQueryBuilder(UserTopic, "userTopic")
        .insert()
        .values(
          dto.topics.map(topic => ({
            id: `${userId}-${topic.id}`,
            userId,
            topicId: topic.id,
          }))
        )
        .execute()
    })

    return true
  }
}
