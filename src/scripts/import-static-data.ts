import { ExpScale, Language, Topic } from "@/database/entities"
import "@/env"
import { ConfigModule } from "@/modules/config/config.module"
import { DatabaseModule } from "@/modules/database/database.module"
import { Module, OnApplicationBootstrap } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm"
import * as fs from "fs"
import * as Papa from "papaparse"
import * as path from "path"
import { Repository } from "typeorm"

@Module({
  imports: [ConfigModule, DatabaseModule, TypeOrmModule.forFeature([Language, Topic, ExpScale])],
})
export class ImportStaticDataModule implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Language) private readonly languageRepository: Repository<Language>,
    @InjectRepository(Topic) private readonly topicRepository: Repository<Topic>,
    @InjectRepository(ExpScale) private readonly expScaleRepository: Repository<ExpScale>
  ) {}

  async onApplicationBootstrap() {
    await this.importLanguageData()
    await this.importTopicData()
    await this.importExpScaleData()
  }

  private async importLanguageData() {
    const csvFilePath = path.join(__dirname, "../../data/language-codes.csv")

    const fileContent = fs.readFileSync(csvFilePath, "utf8")

    const result = Papa.parse(fileContent, {
      header: true,
    }).data as { alpha2: string; English: string }[]

    await this.languageRepository.save(
      result
        .filter(i => i.English)
        .map(item => ({
          id: item.alpha2,
          name: item.English,
        })),
      {
        chunk: 100,
      }
    )
  }

  private async importTopicData() {
    const csvFilePath = path.join(__dirname, "../../data/topics.csv")

    const fileContent = fs.readFileSync(csvFilePath, "utf8")

    const result = Papa.parse(fileContent, {
      header: true,
    }).data as { id: string; name: string }[]

    await this.topicRepository.save(
      result
        .filter(i => i.name)
        .map(item => ({
          id: item.id,
          name: item.name,
        })),
      {
        chunk: 100,
      }
    )
  }

  private async importExpScaleData() {
    const levels = [
      { level: 1, exp: 0, expGap: 0, expScale: 0 },
      { level: 2, exp: 100, expGap: 100, expScale: 0 },
    ]

    const e = 2.71828

    for (let i = 3; i <= 100; i++) {
      const xpScalePerLevel = 1 + 0.5 * Math.pow(e, -0.055 * (i - 2))
      const expGap = Math.round(levels[i - 2].expGap * xpScalePerLevel)
      const exp = levels[i - 2].exp + expGap
      levels.push({ level: i, exp, expGap, expScale: xpScalePerLevel })
    }

    await this.expScaleRepository.save(levels)
  }
}

async function bootstrap() {
  await NestFactory.createApplicationContext(ImportStaticDataModule)
}

bootstrap()
