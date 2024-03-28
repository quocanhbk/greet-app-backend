import { User } from "@/database/entities"
import { GetAPI, PostAPI, PutAPI } from "@/utils/custom.decorators"
import { Body, Controller } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { FirebaseUser, UseFirebaseGuard } from "../auth/auth.guard"
import { SendFriendRequestDto } from "./friend-requests.dto"
import { FriendRequestsService } from "./friend-requests.service"

@UseFirebaseGuard()
@ApiTags("friend-requests")
@Controller("friend-requests")
export class FriendRequestsController {
  constructor(private friendRequestService: FriendRequestsService) {}

  @PostAPI("/send", { description: "Send a friend request", type: Boolean })
  async sendFriendRequest(@FirebaseUser() user: User, @Body() body: SendFriendRequestDto) {
    return this.friendRequestService.sendFriendRequest(user.id, body)
  }

  @GetAPI("/list", { description: "List all friend requests" })
  async listFriendRequests() {
    // Implementation
  }

  @PutAPI("/decide/:id", { description: "Accept/decline a friend request" })
  async decideFriendRequest() {
    // Implementation
  }
}
