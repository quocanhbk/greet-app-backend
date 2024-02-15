import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UpsertUserDto {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  role: string
}

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  userId: string
}

export class SendMessageAs {
  @ApiProperty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsString()
  message: string
}
