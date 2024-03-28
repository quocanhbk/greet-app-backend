import { GetAPI } from "@/utils/custom.decorators"
import { Controller, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { GetLanguagesDto, GetLanguagesResponseDto, LanguageItem } from "./langs.dto"
import { LangsService } from "./langs.service"

@ApiTags("langs")
@Controller("langs")
export class LangsController {
  constructor(private readonly langsService: LangsService) {}

  @GetAPI("/", { type: GetLanguagesResponseDto })
  async getLangs(@Query() query: GetLanguagesDto) {
    return this.langsService.getLangs(query)
  }

  @GetAPI("/:id", { type: LanguageItem })
  async getLangById(id: string) {
    return this.langsService.getLangById(id)
  }
}
