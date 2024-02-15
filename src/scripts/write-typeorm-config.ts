import "@/env"
import { ConfigModule } from "@/modules/config/config.module"
import { ConfigService } from "@/modules/config/config.service"

import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as fs from "fs"
import * as path from "path"

@Module({
  imports: [ConfigModule],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.writeTypeOrmConfig()
  }

  private async writeTypeOrmConfig() {
    const dbConfig = this.configService.typeormConfig
    fs.writeFileSync(
      "ormconfig.json",
      JSON.stringify(
        {
          type: "postgres",
          url: dbConfig.url,
          synchronize: dbConfig.synchronize,
          entities: [path.join(__dirname, "../database/entities/**/*.entity{.js,.ts}")],
          migrations: [path.join(__dirname, "../database/migrations/*{.js,.ts}")],
          cli: {
            migrationsDir: "./src/database/migration",
          },
        },
        null,
        2
      )
    )
  }
}

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule)
}
bootstrap()
