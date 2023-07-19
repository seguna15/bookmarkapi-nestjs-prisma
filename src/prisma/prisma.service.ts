import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(configService: ConfigService){
        super({
            datasources: {
                db: {
                    url: configService.get('DATABASE_URL')
                },
            },
        });
    }

    //tear down logic before e-2-e test
    cleanDb() {
        //transaction ensures the order of db operations
        return this.$transaction([
            this.bookmark.deleteMany(),
            this.user.deleteMany(),
        ]); 
    }
}
