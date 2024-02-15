import { ConfigModule } from "@/modules/config/config.module"
import { ConfigService } from "@/modules/config/config.service"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.typeormConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
