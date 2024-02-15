import { Module, Provider } from "@nestjs/common"
import { StreamChat } from "stream-chat"
import { ConfigKey, ConfigService } from "../config/config.service"
import { StreamController } from "./stream.controller"
import { StreamService } from "./stream.service"

const StreamChatProvider: Provider = {
  provide: "STREAM_CHAT",
  useFactory: (config: ConfigService) => {
    const apiKey = config.get(ConfigKey.STREAM_KEY)
    const apiSecret = config.get(ConfigKey.STREAM_SECRET)
    if (!apiKey || !apiSecret) {
      throw new Error("Stream Chat API key and secret are required")
    }
    return StreamChat.getInstance(apiKey, apiSecret)
  },
  inject: [ConfigService],
}

@Module({
  providers: [StreamService, StreamChatProvider],
})
export class StreamModule {
  static http() {
    return {
      module: StreamModule,
      controllers: [StreamController],
    }
  }
}
