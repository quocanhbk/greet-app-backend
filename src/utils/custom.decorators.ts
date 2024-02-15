import { Roles, UserRole } from "@/modules/auth/auth.guard";
import { Delete, Get, Patch, Post, Put, applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiResponseOptions } from "@nestjs/swagger";

const [GetAPI, PostAPI, PutAPI, PatchAPI, DeleteAPI] = [
  Get,
  Post,
  Put,
  Patch,
  Delete,
].map(
  (method) =>
    (
      path: string,
      options?: ApiResponseOptions,
      role = UserRole.AUTHENTICATED
    ) => {
      return applyDecorators(method(path), ApiOkResponse(options), Roles(role));
    }
);

export { DeleteAPI, GetAPI, PatchAPI, PostAPI, PutAPI };
