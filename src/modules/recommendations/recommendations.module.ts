import { DynamicModule, Module } from "@nestjs/common";
import { RecommendationsService } from "./recommendations.service";
import { RecommendationsController } from "./recommendations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  User,
  UserLanguage,
  UserPreference,
  UserTopic,
} from "@/database/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLanguage, UserTopic, UserPreference]),
  ],
  providers: [RecommendationsService],
})
export class RecommendationsModule {
  static http(): DynamicModule {
    return {
      module: RecommendationsModule,
      controllers: [RecommendationsController],
    };
  }
}
