import { User } from "@/database/entities"
import { Inject, Injectable } from "@nestjs/common"
import { StreamChat } from "stream-chat"
import { GetChannelsResponse, StreamUser, SyncStreamTokenResponse } from "./stream.dto"

@Injectable()
export class StreamService {
  constructor(@Inject("STREAM_CHAT") private readonly streamChat: StreamChat) {}

  async registerToken(user: User): Promise<SyncStreamTokenResponse> {
    const token = this.streamChat.createToken(user.id)
    const result = await this.streamChat.upsertUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: "user",
    })

    return {
      token,
      user: Object.values(result.users)[0] as unknown as StreamUser,
    }
  }

  async getUsers(): Promise<any> {
    const users = await this.streamChat.queryUsers({})
    return users
  }

  // create channel
  async createChannel(userId: string, id: string, name: string) {
    const streamUser = await this.streamChat
      .queryUsers({ id: userId })
      .then(res => res.users.find(user => user.id === userId))

    if (!streamUser) {
      throw new Error("User not found")
    }

    const channel = this.streamChat.channel("messaging", id, { name, created_by_id: streamUser.id }).create()
    return channel
  }

  async getChannels(userId: string): Promise<GetChannelsResponse> {
    const channels = await this.streamChat.queryChannels(
      { type: "messaging", created_by_id: userId },
      { last_message_at: -1 },
      {
        limit: 20,
        offset: 0,
      }
    )
    return {
      channels: channels.map(channel => ({
        id: channel.data.id as string,
        type: channel.data.type as string,
        cid: channel.data.cid as string,
        memberCount: (channel.data.member_count as number) ?? 0,
        name: channel.data.name,
      })),
    }
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
