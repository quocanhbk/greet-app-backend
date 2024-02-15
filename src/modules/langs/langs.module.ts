import { Language } from "@/database/entities/language.entity"
import { DynamicModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LangsController } from "./langs.controller"
import { LangsService } from "./langs.service"

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LangsService],
})
export class LangsModule {
  static http(): DynamicModule {
    return {
      module: LangsModule,
      controllers: [LangsController],
    }
  }
}
