import { GetAPI, PostAPI } from "@/utils/custom.decorators"
import { Body, Controller, Param } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { AddMemberDto, SendMessageAs, UpsertUserDto } from "./stream.dto"
import { StreamService } from "./stream.service"

@Controller("/stream")
@ApiTags("stream")
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @GetAPI("/token/:userId")
  async createToken(@Param("userId") userId: string): Promise<string> {
    const token = await this.streamService.createToken(userId)
    return token
  }

  @PostAPI("/user")
  async upsertUser(@Body() body: UpsertUserDto): Promise<void> {
    await this.streamService.upsertUser(body.userId, body.name, body.role)
  }

  @GetAPI("/users")
  async getUsers(): Promise<any> {
    const users = await this.streamService.getUsers()
    return users
  }

  @GetAPI("/channels")
  async getChannels(): Promise<any> {
    const channels = await this.streamService.getChannels()
    return channels
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
