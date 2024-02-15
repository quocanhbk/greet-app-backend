import {
  Language,
  User,
  UserLanguage,
  UserPreference,
  UserTopic,
} from "@/database/entities";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import {
  UpdateUserInfoDto,
  UpdateUserPreferenceDto,
  UpsertUserLanguageDto,
} from "./user-preferences.dto";

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserTopic)
    private readonly userTopicRepository: Repository<UserTopic>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(UserLanguage)
    private readonly userLanguageRepository: Repository<UserLanguage>,
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>
  ) {}

  public async addUserTopics(
    userId: string,
    topicIds: string[]
  ): Promise<boolean> {
    const userTopics = topicIds.map((topicId) => ({
      id: `${userId}-${topicId}`,
      userId,
      topicId,
    }));
    await this.userTopicRepository.save(userTopics);
    return true;
  }

  public async deleteUserTopics(
    userId: string,
    topicIds: string[]
  ): Promise<boolean> {
    const result = await this.userTopicRepository.delete({
      userId,
      topicId: In(topicIds),
    });
    return result.affected > 0;
  }

  public async updateGeneralInfo(userId: string, dto: UpdateUserInfoDto) {
    await this.userRepository.save({
      id: userId,
      ...dto,
    });

    return true;
  }

  public async upsertUserLanguages(userId: string, dto: UpsertUserLanguageDto) {
    const language = await this.languageRepository.findOneBy({
      id: dto.languageId,
    });

    if (!language) throw new NotFoundException("Language not found");

    const userLanguage = await this.userLanguageRepository.findOneBy({
      userId,
      languageId: dto.languageId,
    });

    if (userLanguage) {
      await this.userLanguageRepository.update(
        { id: userLanguage.id },
        { ...dto }
      );
    } else {
      await this.userLanguageRepository.save({
        id: userId,
        userId,
        languageId: dto.languageId,
        proficiency: dto.proficiency,
        type: dto.type,
      });
    }

    return true;
  }

  public async deleteUserLanguages(userId: string, languageIds: string[]) {
    const result = await this.userLanguageRepository.delete({
      userId,
      languageId: In(languageIds),
    });
    return result.affected > 0;
  }

  public async updateUserPreference(
    userId: string,
    dto: UpdateUserPreferenceDto
  ) {
    const currentPreference = await this.userPreferenceRepository.findOneBy({
      userId,
    });

    if (!currentPreference)
      throw new NotFoundException("User preference not found");

    if (
      dto.ageRangeMin &&
      dto.ageRangeMin >= (currentPreference.ageRangeMax ?? dto.ageRangeMax)
    ) {
      throw new Error("Invalid minimum age range");
    }

    if (
      dto.ageRangeMax &&
      dto.ageRangeMax <= (currentPreference.ageRangeMin ?? dto.ageRangeMin)
    ) {
      throw new Error("Invalid maximum age range");
    }

    await this.userPreferenceRepository.save({
      userId,
      ...dto,
    });

    return true;
  }
}
