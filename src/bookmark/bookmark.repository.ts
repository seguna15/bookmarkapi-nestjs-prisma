import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkRepository{
    constructor(
        private prisma: PrismaService
    ){}

     async getBookmarks(userId:number){
        const bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        });

        return bookmarks;
     }

    async getBookmarkById(userId:number, bookmarkId: number) {
        const bookmark  =  await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        });

        return bookmark;
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            },
        })

        return bookmark;
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        //get the bookmark by id
        const foundBookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        
        //check if user owns the bookmark
        if(!foundBookmark || foundBookmark.userId !== userId) throw new ForbiddenException('Access to resource denied');

        const result = this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            },
        })

        return result;
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        //get the bookmark by id
        const foundBookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        });
        
        //check if user owns the bookmark
        if(!foundBookmark || foundBookmark.userId !== userId) throw new ForbiddenException('Access to resource denied');

        await  this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        })
    }
}