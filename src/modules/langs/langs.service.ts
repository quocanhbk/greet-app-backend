import { Language } from "@/database/entities/language.entity"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { GetLanguagesDto, GetLanguagesResponseDto, LanguageItem } from "./langs.dto"

@Injectable()
export class LangsService {
  constructor(@InjectRepository(Language) private langRepo: Repository<Language>) {}

  async getLangs(query: GetLanguagesDto): Promise<GetLanguagesResponseDto> {
    const result = await this.langRepo.findAndCount({
      skip: query.skip,
      take: query.take,
    })

    return {
      data: result[0],
      total: result[1],
    }
  }

  async getLangById(id: string): Promise<LanguageItem> {
    const result = this.langRepo.findOne({ where: { id } })

    if (!result) throw new NotFoundException("Language not found")

    return result
  }
}
