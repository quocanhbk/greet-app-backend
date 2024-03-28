import { PaginationDto } from "@/dtos/pagination.dto"
import { ApiProperty } from "@nestjs/swagger"

export class GetLanguagesDto extends PaginationDto {
  @ApiProperty()
  search: string
}

export class LanguageItem {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string
}

export class GetLanguagesResponseDto {
  @ApiProperty({ type: [LanguageItem] })
  data: LanguageItem[]

  @ApiProperty()
  total: number
}
