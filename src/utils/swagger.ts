import { INestApplication, VersioningType } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { resolve } from "path"
import { generateApi } from "swagger-typescript-api"

export const setupSwagger = async (app: INestApplication, nodeEnv: string) => {
  const options = new DocumentBuilder()
    .setTitle("Greet App API")
    .setDescription(`Powered by Greet`)
    .setVersion("1.0.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "Firebase Token",
    })
    .build()

  app.enableVersioning({
    type: VersioningType.URI,
  })

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: -1, // no models shown
      defaultModelExpandDepth: -1, // no model properties shown,
      syntaxHighlight: false,
    },
  })

  // generate typescript api
  if (nodeEnv === "local") {
    const docPath = resolve(__dirname, "../../swagger/")

    if (!existsSync(docPath)) {
      mkdirSync(docPath, { recursive: true })
    }

    writeFileSync(resolve(docPath, "swagger.json"), JSON.stringify(document, null, 2))

    await generateApi({
      name: "sdk",
      output: resolve(__dirname, "../../swagger/"),
      spec: document as any,
      prettier: {
        singleQuote: false,
        jsxSingleQuote: false,
        arrowParens: "avoid",
        trailingComma: "all",
        tabWidth: 2,
        printWidth: 120,
        parser: "typescript",
      },
      httpClientType: "axios",
      unwrapResponseData: true,
    })
  }
}
