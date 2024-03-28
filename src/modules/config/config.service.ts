import { Injectable } from "@nestjs/common"
import { ConfigService as NestjsConfigService } from "@nestjs/config"
import * as path from "path"
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

export enum ConfigKey {
  APP_NAME = "APP_NAME",
  NODE_ENV = "NODE_ENV",
  REDIS_URL = "REDIS_URL",
  POSTGRES_URL = "POSTGRES_URL",
  FIREBASE_SERVICE_ACCOUNT = "FIREBASE_SERVICE_ACCOUNT",
  STREAM_KEY = "STREAM_KEY",
  STREAM_SECRET = "STREAM_SECRET",
}

@Injectable()
export class ConfigService {
  constructor(private configService: NestjsConfigService) {}

  public get(name: ConfigKey): string {
    return this.configService.get(name)
  }

  public get nodeEnv(): string {
    return this.get(ConfigKey.NODE_ENV)
  }

  public get firebaseServiceAccount(): Promise<any> {
    return JSON.parse(this.get(ConfigKey.FIREBASE_SERVICE_ACCOUNT))
  }

  public get typeormConfig(): PostgresConnectionOptions {
    return {
      type: "postgres",
      url: this.get(ConfigKey.POSTGRES_URL),
      synchronize: this.nodeEnv !== "production",
      entities: [path.join(__dirname, "../../database/entities/**/*.entity.{ts,js}")],
    }
  }

  public get redis(): string {
    return this.get(ConfigKey.REDIS_URL)
  }
}
