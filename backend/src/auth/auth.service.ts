import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, password: true }
    });  
  
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
  
    const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
    return this.jwtService.sign(payload);    
  }
}  
