import "@/env"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.POSTGRES_URL,
  entities: [
    "/Users/sipherdev/Documents/Projects/flutter_firebase_login/backend/src/database/entities/**/*.entity{.js,.ts}",
  ],
  migrations: ["/Users/sipherdev/Documents/Projects/flutter_firebase_login/backend/src/database/migrations/*{.js,.ts}"],
})
