import { DeleteAPI, GetAPI, PostAPI, PutAPI } from "@/utils/custom.decorators";
import { Body, Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import {
  FirebaseUser,
  IFirebaseUser,
  UseFirebaseGuard,
} from "../auth/auth.guard";
import {
  DeleteUserLanguagesDto,
  UpdateUserInfoDto,
  UpdateUserPreferenceDto,
  UpsertTopicsDto,
  UpsertUserLanguageDto,
} from "./user-preferences.dto";
import { UserPreferencesService } from "./user-preferences.service";
import { GetUserResponseDto, OnboardUserDto } from "./users.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@UseFirebaseGuard()
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPreferencesService: UserPreferencesService
  ) {}

  @GetAPI("/", {
    type: GetUserResponseDto,
    description: "Get user information",
  })
  public async getUserInfo(
    @FirebaseUser() user: IFirebaseUser
  ): Promise<GetUserResponseDto> {
    return this.usersService.getUserInfo(user.id);
  }

  @PutAPI("/", { type: Boolean, description: "Update user information" })
  public async updateGeneralInfo(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: UpdateUserInfoDto
  ) {
    return this.userPreferencesService.updateGeneralInfo(user.id, body);
  }

  @PostAPI("/onboard", { type: Boolean, description: "Onboard new user" })
  public async onboardUser(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: OnboardUserDto
  ): Promise<boolean> {
    return this.usersService.onboardUser(user.id, body);
  }

  @PostAPI("/topics", { type: Boolean, description: "Update user's topics" })
  public async addUserTopics(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: UpsertTopicsDto
  ): Promise<boolean> {
    return this.userPreferencesService.addUserTopics(user.id, body.topicIds);
  }

  @DeleteAPI("/topics", { type: Boolean, description: "Delete user's topics" })
  public async deleteUserTopics(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: UpsertTopicsDto
  ): Promise<boolean> {
    return this.userPreferencesService.deleteUserTopics(user.id, body.topicIds);
  }

  @PostAPI("/languages", {
    type: Boolean,
    description: "Upsert user's languages",
  })
  public async upsertUserLanguages(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: UpsertUserLanguageDto
  ): Promise<boolean> {
    return this.userPreferencesService.upsertUserLanguages(user.id, body);
  }

  @DeleteAPI("/languages", {
    type: Boolean,
    description: "Delete user's languages",
  })
  public async deleteUserLanguages(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: DeleteUserLanguagesDto
  ): Promise<boolean> {
    return this.userPreferencesService.deleteUserLanguages(
      user.id,
      body.languageIds
    );
  }

  @PostAPI("/preferences", {
    type: Boolean,
    description: "Update user's preferences",
  })
  public async updateUserPreference(
    @FirebaseUser() user: IFirebaseUser,
    @Body() body: UpdateUserPreferenceDto
  ): Promise<boolean> {
    return this.userPreferencesService.updateUserPreference(user.id, body);
  }
}
