import { FriendRequest, FriendRequestStatus, Friendship, User } from "@/database/entities"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SendFriendRequestDto } from "./friend-requests.dto"

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest) private friendRequestRepo: Repository<FriendRequest>,
    @InjectRepository(Friendship) private friendshipRepo: Repository<Friendship>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  public async sendFriendRequest(userId: string, { friendId }: SendFriendRequestDto): Promise<boolean> {
    if (userId === friendId) {
      throw new BadRequestException("You cannot send friend request to yourself")
    }

    const isFriendExist = await this.userRepo.findOne({ where: { id: friendId } })

    if (!isFriendExist) {
      throw new NotFoundException("User not found")
    }

    // throw bad request exception when there is already pending request
    const isFriendRequestExist = await this.friendRequestRepo
      .createQueryBuilder("friendRequest")
      .whereGroup(qb =>
        qb
          .whereGroup(qb =>
            qb.where("requesterId = :userId", { userId }).andWhere("requesteeId = :friendId", { friendId })
          )
          .orWhereGroup(qb =>
            qb.where("requesterId = :friendId", { friendId }).andWhere("requesteeId = :userId", { userId })
          )
      )
      .andWhere("status = :status", { status: FriendRequestStatus.PENDING })
      .getOne()

    if (isFriendRequestExist) {
      throw new BadRequestException("Friend request already sent")
    }

    // throw bad request exception when they are already friends
    const isFriendshipExist = await this.friendshipRepo
      .createQueryBuilder("friendship")
      .whereGroup(
        qb =>
          qb
            .whereGroup(qb => qb.where("user1Id = :userId", { userId }).andWhere("user2Id = :friendId"))
            .orWhereGroup(qb => qb.where("user1Id = :friendId", { friendId }).andWhere("user2Id = :userId")),
        { userId, friendId }
      )
      .getOne()

    if (isFriendshipExist) {
      throw new BadRequestException("You are already friends")
    }

    // throw bad request exception when request is declined less than a day ago
    const isFriendRequestDeclined = await this.friendRequestRepo
      .createQueryBuilder("friendRequest")
      .where("requesterId = :userId", { userId })
      .andWhere("requesteeId = :friendId", { friendId })
      .andWhere("status = :status", { status: FriendRequestStatus.DECLINED })
      .andWhere("updatedAt > NOW() - INTERVAL '1 day'")
      .getOne()

    if (isFriendRequestDeclined) {
      throw new BadRequestException("Friend request declined less than a day ago")
    }

    // TODO: check if they are blocked

    // save friend request
    await this.friendRequestRepo.save({ requesterId: userId, requesteeId: friendId })

    // TODO: send notification

    return true
  }
}
