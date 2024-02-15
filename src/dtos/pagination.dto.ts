import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class PaginationDto {
  @ApiProperty({ default: 0, required: false })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  skip?: number

  @ApiProperty({ default: 10, required: false })
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  take?: number
}
