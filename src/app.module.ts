import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./modules/auth/auth.module"
import { ConfigModule } from "./modules/config/config.module"
import { DatabaseModule } from "./modules/database/database.module"
import { FriendRequestsModule } from "./modules/friend-requests/friend-requests.module"
import { LangsModule } from "./modules/langs/langs.module"
import { RecommendationsModule } from "./modules/recommendations/recommendations.module"
import { StreamModule } from "./modules/stream/stream.module"
import { UsersModule } from "./modules/users/users.module"
@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    StreamModule.http(),
    LangsModule.http(),
    UsersModule.http(),
    RecommendationsModule.http(),
    FriendRequestsModule.http(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
