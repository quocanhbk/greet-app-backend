import { UserGender, UserLanguageType } from "@/database/entities"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class UserLanguageDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  proficiency: number

  @ApiProperty({ enum: UserLanguageType, enumName: "UserLanguageType" })
  type: UserLanguageType
}

export class UserPreferenceDto {
  @ApiProperty()
  partnerDescription: string

  @ApiProperty()
  @IsOptional()
  locationRange?: number

  @ApiProperty()
  @IsOptional()
  ageRangeMin?: number

  @ApiProperty()
  @IsOptional()
  ageRangeMax?: number
}

export class UserTopicDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class GetUserResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string

  @ApiProperty()
  photo: string

  @ApiProperty()
  phoneNumber: string

  @ApiProperty()
  introduction: string

  @ApiProperty()
  dateOfBirth: string

  @ApiProperty({ enum: UserGender, enumName: "UserGender" })
  gender: UserGender

  @ApiProperty({ type: [UserLanguageDto] })
  languages: UserLanguageDto[]

  @ApiProperty({ type: UserPreferenceDto, nullable: true })
  preference: UserPreferenceDto | null

  @ApiProperty({ type: [UserTopicDto] })
  topics: UserTopicDto[]
}

export class OnboardUserLanguageDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(0)
  @Max(10)
  proficiency: number

  @ApiProperty({ enum: UserLanguageType, enumName: "UserLanguageType" })
  type: UserLanguageType
}

export class OnboardUserTopicDto {
  @ApiProperty()
  id: string
}

export class OnboardUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  introduction: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  dateOfBirth: string

  @ApiProperty({ enum: UserGender, enumName: "UserGender" })
  @IsEnum(UserGender)
  @IsOptional()
  gender: UserGender

  @ApiProperty({ type: [OnboardUserLanguageDto] })
  languages: OnboardUserLanguageDto[]

  @ApiProperty({ type: UserPreferenceDto })
  preference: UserPreferenceDto

  @ApiProperty({ type: [OnboardUserTopicDto] })
  topics: OnboardUserTopicDto[]
}
