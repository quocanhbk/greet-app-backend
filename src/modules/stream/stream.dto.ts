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

export class StreamUser {
  @ApiProperty()
  id: string

  @ApiProperty()
  role: string

  @ApiProperty()
  created_at: string

  @ApiProperty()
  updated_at: string

  @ApiProperty()
  banned: boolean

  @ApiProperty()
  online: boolean

  @ApiProperty()
  name: string

  @ApiProperty()
  email: string
}

export class SyncStreamTokenResponse {
  @ApiProperty()
  token: string

  @ApiProperty({ type: StreamUser })
  user: StreamUser
}

export class StreamChannelItem {
  // id
  @ApiProperty()
  id: string

  // type
  @ApiProperty()
  type: string

  // cid
  @ApiProperty()
  cid: string

  // memberCount
  @ApiProperty()
  memberCount: number

  // name
  @ApiProperty()
  name: string
}

export class GetChannelsResponse {
  @ApiProperty({ type: [StreamChannelItem] })
  channels: StreamChannelItem[]
}
