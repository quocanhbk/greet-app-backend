import { CacheModule, CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Module } from "@nestjs/common"
import { redisStore } from "cache-manager-ioredis-yet"
import { ConfigService } from "../config/config.service"

export const InjectCacheManager = () => Inject(CACHE_MANAGER)

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.redis
        const url = new URL(redisUrl) // Parsing the URL

        const host = url.hostname
        const port = parseInt(url.port, 10) || 6379
        let username: string | undefined = url.username || undefined
        let password: string | undefined = url.password || undefined

        return {
          store: redisStore,
          host,
          port,
          username,
          password,
          isGlobal: true,
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
