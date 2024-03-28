import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class SendFriendRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  friendId: string
}
