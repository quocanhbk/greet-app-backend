import { Inject, Injectable } from "@nestjs/common"
import { StreamChat } from "stream-chat"

@Injectable()
export class StreamService {
  constructor(@Inject("STREAM_CHAT") private readonly streamChat: StreamChat) {
    this.streamChat.channel("messaging", "channel1", { name: "Channel 1", created_by_id: "greetteam" }).create()
  }

  async createToken(userId: string): Promise<string> {
    const token = this.streamChat.createToken(userId)
    return token
  }

  async upsertUser(userId: string, name: string, role: string): Promise<void> {
    const user = { id: userId, name, role }
    await this.streamChat.upsertUsers([
      {
        id: user.id,
        role: user.role,
        name: user.name,
      },
    ])
  }

  async getUsers(): Promise<any> {
    const users = await this.streamChat.queryUsers({})
    return users
  }

  async getChannels(): Promise<any> {
    const channels = await this.streamChat.queryChannels({ type: "messaging" })
    return channels
  }

  async getCurrentChannel(channelId: string): Promise<any> {
    const channel = await this.streamChat.channel("messaging", channelId).create()
    return channel
  }

  async getChannelMembers(channelId: string): Promise<any> {
    const members = await this.streamChat.channel("messaging", channelId).queryMembers({})
    return members
  }

  async addMember(channelId: string, userId: string): Promise<any> {
    const channel = this.streamChat.channel("messaging", channelId)
    const result = await channel.addMembers([userId])
    return result
  }

  async sendMessageAs(userId: string, channelId: string, message: string): Promise<any> {
    const channel = this.streamChat.channel("messaging", channelId)
    const result = await channel.sendMessage({
      user_id: userId,
      text: message,
    })
    return result
  }

  async getMessages(channelId: string): Promise<any> {
    const channel = this.streamChat.channel("messaging", channelId)
    const result = await channel.query({ messages: { limit: 100 } })
    return result.messages
  }
}
