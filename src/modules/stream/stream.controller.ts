import { User } from "@/database/entities"
import { GetAPI, PostAPI } from "@/utils/custom.decorators"
import { Body, Controller, Param } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger"
import { FirebaseUser, UseFirebaseGuard } from "../auth/auth.guard"
import { AddMemberDto, GetChannelsResponse, SendMessageAs, SyncStreamTokenResponse } from "./stream.dto"
import { StreamService } from "./stream.service"
@Controller("/stream")
@ApiTags("stream")
@ApiBearerAuth()
@UseFirebaseGuard()
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @GetAPI("/sync-token", { type: SyncStreamTokenResponse })
  async syncToken(@FirebaseUser() user: User): Promise<SyncStreamTokenResponse> {
    const token = await this.streamService.registerToken(user)
    return token
  }

  @GetAPI("/users")
  async getUsers(): Promise<any> {
    const users = await this.streamService.getUsers()
    return users
  }

  @GetAPI("/channels", { type: GetChannelsResponse })
  async getChannels(@FirebaseUser() user: User): Promise<GetChannelsResponse> {
    const channels = await this.streamService.getChannels(user.id)
    return channels
  }

  @PostAPI("/channel")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
      },
    },
  })
  async createChannel(@FirebaseUser() user: User, @Body() body: { id: string; name: string }): Promise<any> {
    const channel = await this.streamService.createChannel(user.id, body.id, body.name)
    return channel
  }

  @GetAPI("/channel/:channelId")
  async getCurrentChannel(@Param("channelId") channelId: string): Promise<any> {
    const channel = await this.streamService.getCurrentChannel(channelId)
    return channel
  }

  @GetAPI("/channel/:channelId/members")
  async getChannelMembers(@Param("channelId") channelId: string): Promise<any> {
    const members = await this.streamService.getChannelMembers(channelId)
    return members
  }

  @PostAPI("/channel/:channelId/members")
  async addMember(@Param("channelId") channelId: string, @Body() body: AddMemberDto): Promise<any> {
    const result = await this.streamService.addMember(channelId, body.userId)
    return result
  }

  @PostAPI("/channel/:channelId/messages")
  async sendMessageAs(@Param("channelId") channelId: string, @Body() body: SendMessageAs): Promise<any> {
    const result = await this.streamService.sendMessageAs(body.userId, channelId, body.message)
    return result
  }

  @GetAPI("/channel/:channelId/messages")
  async getMessages(@Param("channelId") channelId: string): Promise<any> {
    const result = await this.streamService.getMessages(channelId)
    return result
  }
}
