import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestjsConfigModule } from "@nestjs/config"
import * as path from "path"
import { ConfigService } from "./config.service"

@Global()
@Module({
  imports: [
    NestjsConfigModule.forRoot({
      envFilePath: [".env.local", ".env"].map(envFile => path.join(__dirname, `../../${envFile}`)),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
