import { Injectable } from '@nestjs/common';
import { BookmarkRepository } from './bookmark.repository';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(
        private bookmarkRepository: BookmarkRepository
    ){}

  
    async getBookmarks(userId:number){
        return this.bookmarkRepository.getBookmarks(userId);
    }

    async getBookmarkById(userId:number, bookmarkId: number) {
        return this.bookmarkRepository.getBookmarkById(userId, bookmarkId);
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        return this.bookmarkRepository.createBookmark(userId, dto);
    }

    async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
        return this.bookmarkRepository.editBookmarkById(userId, bookmarkId, dto);
    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {
        return this.bookmarkRepository.deleteBookmarkById(userId,bookmarkId);
    }
}
