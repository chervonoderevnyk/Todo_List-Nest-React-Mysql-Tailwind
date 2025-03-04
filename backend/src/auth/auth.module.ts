import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "supersecretkey",
      signOptions: { expiresIn: "3h" },
    }),
  ],
  providers: [AuthService, PrismaService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
