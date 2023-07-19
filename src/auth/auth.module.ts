import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, JwtStrategy],
})
export class AuthModule {}