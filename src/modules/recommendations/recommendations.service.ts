import { User, UserLanguage, UserLanguageType, UserPreference, UserTopic } from "@/database/entities"
import { PaginationDto } from "@/dtos/pagination.dto"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserLanguage)
    private readonly userLanguageRepo: Repository<UserLanguage>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepo: Repository<UserPreference>,
    @InjectRepository(UserTopic)
    private readonly userTopicRepo: Repository<UserTopic>
  ) {}

  public async getRecommendations(userId: string, dto: PaginationDto) {
    // Summary: This method returns a list of recommended users based on the user's languages, preferences and topics.
    // - Other users' fluent languages should match the user's learning languages.
    // - Other users' learning languages should match the user's fluent languages.
    // - Other users' topics should have at least one match with the user's topics.
    const currentUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ["userLanguages", "preference", "userTopics"],
    })

    const learningLanguageIds = currentUser.userLanguages
      .filter(lang => lang.type === UserLanguageType.Learning)
      .map(l => l.languageId)

    const fluentLanguageIds = currentUser.userLanguages
      .filter(lang => lang.type === UserLanguageType.Fluent)
      .map(l => l.languageId)

    const recommendedUsers = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.userLanguages", "userLanguages")
      .leftJoinAndSelect("userLanguages.language", "language")
      .leftJoinAndSelect("user.preference", "preference")
      .leftJoinAndSelect("user.userTopics", "userTopics")
      .leftJoinAndSelect("userTopics.topic", "topic")
      .where("user.id != :userId", { userId })
      .andWhereGroup(qb => {
        qb.where("userLanguages.languageId IN (:...learningLanguageIds)", { learningLanguageIds }).andWhere(
          "userLanguages.type = :fluentType",
          { fluentType: UserLanguageType.Fluent }
        )
      })
      .andWhereGroup(qb => {
        qb.where("userLanguages.languageId IN (:...fluentLanguageIds)", { fluentLanguageIds }).andWhere(
          "userLanguages.type = :learningType",
          { learningType: UserLanguageType.Learning }
        )
      })
      .skip(dto.skip || 0)
      .take(dto.take || 10)
      .getMany()

    return recommendedUsers.map(u => ({
      id: u.id,
      name: u.name,
      languages: u.userLanguages.map(lang => ({
        id: lang.id,
        language: lang.language.name,
        proficiency: lang.proficiency,
        type: lang.type,
      })),
      preference: u.preference,
      topics: u.userTopics.map(topic => ({
        id: topic.id,
        name: topic.topic.name,
      })),
    }))
  }
}
