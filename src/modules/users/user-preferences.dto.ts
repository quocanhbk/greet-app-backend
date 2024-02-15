import { UserGender, UserLanguageType } from "@/database/entities";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Max, Min } from "class-validator";

export class UpsertTopicsDto {
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  topicIds: string[];
}

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  introduction?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ enum: UserGender, enumName: "UserGender" })
  @IsEnum(UserGender)
  @IsOptional()
  gender: UserGender;
}

export class UpsertUserLanguageDto {
  @ApiProperty()
  languageId: string;

  @ApiProperty()
  proficiency: number;

  @ApiProperty({ enum: UserLanguageType, enumName: "UserLanguageType" })
  type: UserLanguageType;
}

export class DeleteUserLanguagesDto {
  @ApiProperty({ type: [String] })
  languageIds: string[];
}

export class UpdateUserPreferenceDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Max(200)
  partnerDescription?: string;

  @ApiProperty()
  @IsOptional()
  locationRange?: number;

  @ApiProperty()
  @IsOptional()
  @Min(14)
  ageRangeMin?: number;

  @ApiProperty()
  @IsOptional()
  @Max(100)
  ageRangeMax?: number;
}
