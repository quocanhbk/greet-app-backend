import { User, UserLanguage, UserLanguageType, UserPreference, UserTopic } from "@/database/entities"
import { PaginationDto } from "@/dtos/pagination.dto"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserLanguage) private readonly userLanguageRepo: Repository<UserLanguage>,
    @InjectRepository(UserPreference) private readonly userPreferenceRepo: Repository<UserPreference>,
    @InjectRepository(UserTopic) private readonly userTopicRepo: Repository<UserTopic>
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

    const learningLanguages = currentUser.userLanguages.filter(lang => lang.type === UserLanguageType.Learning)
    const fluentLanguages = currentUser.userLanguages.filter(lang => lang.type === UserLanguageType.Fluent)
    const userTopics = currentUser.userTopics.map(topic => topic.topicId)

    const recommendedUsers = await this.userRepo
      .createQueryBuilder("users")
      .leftJoinAndSelect("users.userLanguages", "userLanguages")
      .leftJoinAndSelect("users.preference", "preference")
      .leftJoinAndSelect("users.userTopics", "userTopics")
      .where("users.id != :userId", { userId })
      .andWhereGroup(qb =>
        qb
          .where("userLanguages.languageId IN (:...languageIds)", {
            languageIds: learningLanguages.map(lang => lang.languageId),
          })
          .andWhere("userLanguages.fluency = :learning", { learning: UserLanguageType.Fluent })
      )
      .andWhereGroup(qb =>
        qb
          .where("userLanguages.languageId IN (:...languageIds)", {
            languageIds: fluentLanguages.map(lang => lang.languageId),
          })
          .andWhere("userLanguages.fluency = :fluent", { fluent: UserLanguageType.Learning })
      )
      .andWhere("userTopics.topicId IN (:...topicIds)", { topicIds: userTopics })
      .skip(dto.skip || 0)
      .take(dto.take || 10)
      .getMany()

    return recommendedUsers
  }
}
