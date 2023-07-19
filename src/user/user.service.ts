import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    
    constructor(
        private userRepository:UserRepository
    ) {}

    async editUser(userId: number, dto: EditUserDto) {
        return await this.userRepository.editUser(userId, dto);
    }
}
