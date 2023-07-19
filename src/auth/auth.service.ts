import {Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import { AuthRepository } from "./auth.repository";


@Injectable()
export class AuthService { 
    constructor(
        private authRepository: AuthRepository,
        
    ){}

    async signup(dto: AuthDto){
        return await this.authRepository.signup(dto);
    }

    async login(dto: AuthDto){
        return await this.authRepository.login(dto);
    }
}