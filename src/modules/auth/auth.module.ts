import { ConfigService } from "@/modules/config/config.service";
import { Global, Module, Provider } from "@nestjs/common";
import admin from "firebase-admin";

const firebaseProvider: Provider = {
  provide: "FIREBASE_AUTH",
  useFactory: async (configService: ConfigService) => {
    const serviceAccount = await configService.firebaseServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin.auth();
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [firebaseProvider],
  exports: [firebaseProvider],
})
export class AuthModule {}
