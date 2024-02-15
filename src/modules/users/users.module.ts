import { Language, User, UserLanguage, UserPreference, UserTopic } from "@/database/entities"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserPreferencesService } from "./user-preferences.service"
import { UsersController } from "./users.controller"
import { UsersService } from "./users.service"

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference, UserLanguage, Language, UserTopic])],
  providers: [UsersService, UserPreferencesService],
  exports: [UsersService, UserPreferencesService],
})
export class UsersModule {
  static http() {
    return {
      module: UsersModule,
      controllers: [UsersController],
    }
  }
}
