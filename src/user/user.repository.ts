import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EditUserDto } from "./dto";
import { User } from "@prisma/client";


@Injectable()
export class UserRepository {
    constructor(
        private prisma: PrismaService
    ) {}

    async editUser(userId: number, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...dto,
            },
        });

        delete user.hash;

        return user;
    }
} 