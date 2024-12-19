import { Body, HttpException, Inject, Injectable, Req, Res } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationServie } from 'src/common/validation/validation';
import { UpdateUserRequest, LoginUserRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { http, Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { response, Request } from 'express';
import { User } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationServie,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private mailService: MailerService
    ) { }

    async registerUser(request: RegisterUserRequest): Promise<UserResponse> {

        const registerRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const check = await this.prismaService.user.count({
            where: {
                username: request.username
            }
        })

        if (check != 0) {
            throw new HttpException(`Username ${request.username} telah digunakan`, 404)
        }

        const hashedPW = await bcrypt.hash(registerRequest.password, 10)



        const user = await this.prismaService.user.create({
            data: {
                username: registerRequest.username,
                password: hashedPW,
                name: request.name,
                email: request.email
            }
        })

        return {
            username: user.username,
            name: user.name
        }
    }

    async loginUser(req: LoginUserRequest,): Promise<any> {
        const user = this.validationService.validate(UserValidation.LOGIN, req)
        const tokenVerif = Math.floor(Math.random() * 100000)

        const findUser = await this.prismaService.user.findFirst({
            where: {
                username: req.username
            }
        })

        if (!findUser) {
            throw new HttpException(`Username ${req.username} is not found`, 404)
        }

        const token = this.jwtService.sign({
            username: user.username,
        });

        this.mailService.sendMail(findUser.email, tokenVerif)

    
        const updateUser = await this.prismaService.user.update({
            where: { username: user.username },
            data: { token: tokenVerif },
        });

        return {
            username: user.username,
            name: user.name,
            token: token,
            tokenVerif: tokenVerif
        }

    }

    async verify(username: string, tokenVerif: number) {
        const user = await this.prismaService.user.findFirst({
            where: { username },
        });

        const getToken = async (username) => {
            const user = await this.prismaService.user.findFirst({
                where: {
                    username: username
                }
            })
            return user.token
        }

        const token = await getToken(username);

        if (!token) {
            throw new HttpException('Token tidak ditemukan', 404);
        }
    
        if (token !== tokenVerif) {
            throw new HttpException('Token Anda Tidak Valid', 400);
        }
        const checkV = await this.prismaService.user.findFirst({
            where: {
                username: username
            }
        })

        if(checkV.isVerified){
            throw new HttpException(`User Sudah Verifikasi`, 401)
        }

        return await this.prismaService.user.update({
            where: { username },
            data: { token: null, isVerified: true },
        });
    }

    async update(user: any, req: UpdateUserRequest): Promise<any> {
        const userReq = this.validationService.validate(UserValidation.UPDATE, req)

        const find = await this.prismaService.user.findUnique({
            where: {
                username: user
            }
        })

        if (!find) {
            throw new HttpException(`Username ${req.username} is not found`, 404)
        }

        userReq.password = await bcrypt.hash(userReq.password, 10)

        return await this.prismaService.user.update({
            where: { username: user },
            data: { ...userReq },
        });

    }

}
