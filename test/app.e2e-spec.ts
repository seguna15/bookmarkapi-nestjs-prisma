import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing'
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '../src/bookmark/dto';

describe('App e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true
            }),
        );
        await app.init();   
        await app.listen(3333);
        prisma = app.get(PrismaService);

        await prisma.cleanDb();
        pactum.request.setBaseUrl('http://localhost:3333');
    });

    afterAll(() => {
        app.close();
    });
    it.todo('should pass');
    
    //writing out test 
    describe('Auth', () => {
        const dto: AuthDto =  {
            email: 'test@example.com',
            password: '123'
        };
        describe('Signup', () => {
            it('should throw an exception if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ 
                        password: dto.password
                    })
                    .expectStatus(400);       
            });
            it('should throw an exception if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ 
                        email: dto.email
                    })
                    .expectStatus(400);       
            });
            it('should throw an exception if without dto', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody({ 
                       
                    })
                    .expectStatus(400);       
            });

            it('should sign up', () => {
                return pactum
                    .spec()
                    .post('/auth/signup')
                    .withBody(dto)
                    .expectStatus(201);       
            });
        });
        
        
        describe('Login', () => {
            
            it('should throw an exception if email is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ 
                        password: dto.password
                    })
                    .expectStatus(400);       
            });
            it('should throw an exception if password is empty', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ 
                        email: dto.email
                    })
                    .expectStatus(400);       
            });
            it('should throw an exception if without dto', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ 
                       
                    })
                    .expectStatus(400);       
            });
            it('should sign in', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody(dto)
                    .expectStatus(200).stores('userAt', 'access_token');
            });
        });
    });

    describe('User', () => {
        describe('Get me', () => {
            it('should get current user', () => {
                return pactum
                    .spec()
                    .get('/users/me')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200);
            });
        });
        
        describe('Edit user', () => {
            it('should edit user', () => {
                const dto: EditUserDto = {
                    firstName: 'Test',
                    email: 'test@example.com'
                }
                return pactum
                    .spec()
                    .patch('/users')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(200)
                    .expectBodyContains(dto.firstName)
                    .expectBodyContains(dto.email);
            });
        });
    });

    describe('Bookmarks', () => {

        describe('Get empty bookmarks', () => {
            it("Should get empty bookmarks", () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBody([]);
            });
        });
        

        describe('Create bookmarks', () => {
            const dto: CreateBookmarkDto = {
                title: 'First bookmark',
                link: 'https://www.typescriptlang.org/docs/handbook/utility-types.html',
            }
            it("Should create bookmarks", () => {
                return pactum
                    .spec()
                    .post('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('bookmarkId', 'id');
            });
        });
        
        describe('Get bookmarks', () => {
            it("Should get bookmarks", () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(1)
            });
        });

        describe('Get bookmark by id', () => {
            it("Should get bookmark by id", () => {
                return pactum
                    .spec()
                    .get('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBodyContains('$S{bookmarkId}')
            });
        });

        describe('Edit bookmark by id', () => {
            const dto: EditBookmarkDto = {
                title: 'Utility Types',
                description: 'TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.'
            }
            it("Should edit bookmark by id", () => {
                return pactum
                    .spec()
                    .patch('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withBody(dto)
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.description);
            });
        });

        describe('Delete bookmark by id', () => {
             it("Should delete bookmark by id", () => {
                return pactum
                    .spec()
                    .delete('/bookmarks/{id}')
                    .withPathParams('id', '$S{bookmarkId}')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(204);
            });
        });

        describe('Get empty bookmarks', () => {
            it("Should get bookmarks", () => {
                return pactum
                    .spec()
                    .get('/bookmarks')
                    .withHeaders({
                        Authorization: 'Bearer $S{userAt}'
                    })
                    .expectStatus(200)
                    .expectJsonLength(0)
            });
        });
    });

});