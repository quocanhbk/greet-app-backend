// src/auth/firebase-auth.guard.ts
import { User } from "@/database/entities";
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectEntityManager } from "@nestjs/typeorm";
import admin from "firebase-admin";
import { Observable } from "rxjs";
import { EntityManager } from "typeorm";

export enum UserRole {
  EVERYONE = "EVERYONE",
  AUTHENTICATED = "AUTHENTICATED",
}

export const ROLES_KEY = "AUTHORIZED_ROLES";

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export type IFirebaseUser = User;

export type AuthRequest = Request & {
  firebaseUser?: IFirebaseUser;
};

export const FirebaseUser = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.firebaseUser;
  }
);

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject("FIREBASE_AUTH") private readonly auth: admin.auth.Auth,
    @InjectEntityManager() private entityManager: EntityManager
  ) {}

  private logger = new Logger(FirebaseAuthGuard.name);

  public async verifyIdToken(token: string): Promise<IFirebaseUser> {
    return this.auth
      .verifyIdToken(token.trim().split(" ").pop())
      .then(async (decodedToken) => this.initUser(decodedToken))
      .catch((e) => {
        console.log(JSON.stringify(e));
        this.logger.error("Failed to verify token");
        throw new UnauthorizedException("Invalid token");
      });
  }

  public canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizedRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler()
    );

    const authorizationHeader = request.headers["authorization"];

    if (!authorizedRoles || authorizedRoles.includes(UserRole.EVERYONE)) {
      return true;
    }

    if (!authorizationHeader) {
      throw new UnauthorizedException("No authorization header");
    }

    return this.verifyIdToken(authorizationHeader).then((user) => {
      request.firebaseUser = user;
      return true;
    });
  }

  public async initUser(
    decodedToken: admin.auth.DecodedIdToken
  ): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: { id: decodedToken.uid },
    });

    if (user) return user;

    const newUser = await this.entityManager.save(User, {
      id: decodedToken.uid,
      name: decodedToken?.name ?? "",
      email: decodedToken.email,
      photo: decodedToken.picture,
    });

    return newUser;
  }
}

export const UseFirebaseGuard = () => UseGuards(FirebaseAuthGuard);
