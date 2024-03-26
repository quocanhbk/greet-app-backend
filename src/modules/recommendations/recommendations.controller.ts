import { PaginationDto } from "@/dtos/pagination.dto";
import { GetAPI } from "@/utils/custom.decorators";
import { Controller, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserRole } from "../auth/auth.guard";
import { RecommendationsService } from "./recommendations.service";

@ApiTags("recommendations")
@Controller("recommendations")
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

  @GetAPI("/:userId", {}, UserRole.EVERYONE)
  public async getRecommendations(
    @Param("userId") userId: string,
    @Query() dto: PaginationDto
  ) {
    return this.recommendationsService.getRecommendations(userId, dto);
  }
}
