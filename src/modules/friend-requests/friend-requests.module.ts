import { DynamicModule, Module } from "@nestjs/common"
import { FriendRequestsController } from "./friend-requests.controller"
import { FriendRequestsService } from "./friend-requests.service"

@Module({
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {
  public static http(): DynamicModule {
    return {
      module: FriendRequestsModule,
      controllers: [FriendRequestsController],
    }
  }
}
