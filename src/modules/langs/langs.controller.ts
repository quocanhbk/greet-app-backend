import { GetAPI } from "@/utils/custom.decorators";
import { Controller, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UseFirebaseGuard } from "../auth/auth.guard";
import {
  GetLanguagesDto,
  GetLanguagesResponseDto,
  LanguageItem,
} from "./langs.dto";
import { LangsService } from "./langs.service";

@UseFirebaseGuard()
@ApiTags("langs")
@ApiBearerAuth()
@Controller("langs")
export class LangsController {
  constructor(private readonly langsService: LangsService) {}

  @GetAPI("/", { type: GetLanguagesResponseDto })
  async getLangs(@Query() query: GetLanguagesDto) {
    return this.langsService.getLangs(query);
  }

  @GetAPI("/:id", { type: LanguageItem })
  async getLangById(id: string) {
    return this.langsService.getLangById(id);
  }
}
