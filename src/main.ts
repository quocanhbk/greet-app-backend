import { Logger, ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import "./env"
import { ConfigKey, ConfigService } from "./modules/config/config.service"
import { setupSwagger } from "./utils/swagger"
import "./utils/typeorm-query"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  const configService = app.get(ConfigService)
  const appName = configService.get(ConfigKey.APP_NAME)

  app.enableCors({
    credentials: true,
    origin: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )

  app.enableShutdownHooks()

  setupSwagger(app, configService.get(ConfigKey.NODE_ENV))

  await app.listen(5500, () => {
    Logger.log(`🚀 ${appName} is running at http://localhost:5500/api`)
  })
}
bootstrap()
