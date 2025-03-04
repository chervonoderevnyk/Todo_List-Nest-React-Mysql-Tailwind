import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

import { UserPayload } from "./user.payload";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid token");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload: UserPayload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      console.error('Помилка верифікації токена:', error);
      throw new UnauthorizedException("Invalid token");
    }
}
}