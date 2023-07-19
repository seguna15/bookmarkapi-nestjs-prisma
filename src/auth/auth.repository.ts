import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./strategy";



@Injectable()
export class AuthRepository {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async signup(dto: AuthDto){
        //generate the password hash
        const hash = await argon.hash(dto.password);

        try {
            //save the new user in the db
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });

            return this.signToken(user.id, user.email)
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError ) {
                
                if(error.code === 'P2002') {
                    throw new ConflictException('Credentials taken');
                }
            }
            throw new InternalServerErrorException;
        }   
    }

    async login(dto: AuthDto){
        //find user by email
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        });
        //if user does not exist throw exception
        if(!user) throw new ForbiddenException('Credentials incorrect');
        //compare password
        const pwMatches = await argon.verify(user.hash, dto.password);
        //if password incorrect throw exception
        if(!pwMatches) throw new ForbiddenException('Credentials incorrect');
        //send back the user
        
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload: JwtPayload = {
            sub: userId,
            email
        }

        const token = await this.jwtService.signAsync(
            payload, {
            expiresIn: '15m',
            secret: this.configService.get('JWT_SECRET')
        })

        return {
            access_token: token
        }
    }
}