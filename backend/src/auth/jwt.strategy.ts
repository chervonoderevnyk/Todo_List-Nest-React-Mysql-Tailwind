import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User as PrismaUser } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { UserRoleEnum } from "@/common/enums/user.role.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: number; email: string; role: string }): Promise<PrismaUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
  
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
  
    return { ...user, role: payload.role as UserRoleEnum };
  }
}  
