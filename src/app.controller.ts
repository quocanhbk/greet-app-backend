import { Controller, Get } from "@nestjs/common"
import { AppService } from "./app.service"
import { Roles, UseFirebaseGuard, UserRole } from "./modules/auth/auth.guard"

@UseFirebaseGuard()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  @Roles(UserRole.EVERYONE)
  getHello(): string {
    return this.appService.getHello()
  }

  @Get("/protected")
  @Roles(UserRole.EVERYONE)
  getProtected(): string {
    return "protected"
  }
}
