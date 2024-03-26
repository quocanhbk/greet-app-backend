import { GetAPI, PostAPI, PutAPI } from "@/utils/custom.decorators"
import { Controller } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { UseFirebaseGuard } from "../auth/auth.guard"

@UseFirebaseGuard()
@ApiTags("friend-requests")
@Controller("friend-requests")
export class FriendRequestsController {
  @PostAPI("/send", { description: "Send a friend request" })
  async sendFriendRequest() {
    // Implementation
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
