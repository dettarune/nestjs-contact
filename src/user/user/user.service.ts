import { Body, HttpException, Inject, Injectable, Param, Query, Req, Res } from '@nestjs/common';
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
import * as qrcode from 'qrcode'
import { QrcodeService } from 'src/qrcode/qrcode.service';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationServie,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private mailService: MailerService,
        private qrcode: QrcodeService
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

    // async verify(username: string, tokenVerif: number) {
    //     const user = await this.prismaService.user.findFirst({
    //         where: { username },
    //     });

    //     const getToken = async (username) => {
    //         const user = await this.prismaService.user.findFirst({
    //             where: {
    //                 username: username
    //             }
    //         })
    //         return user.token
    //     }

    //     const token = await getToken(username);

    //     if (!token) {
    //         throw new HttpException('Token tidak ditemukan', 404);
    //     }
    
    //     if (token !== tokenVerif) {
    //         throw new HttpException('Token Anda Tidak Valid', 400);
    //     }
    //     const checkV = await this.prismaService.user.findFirst({
    //         where: {
    //             username: username
    //         }
    //     })

    //     if(checkV.isVerified){
    //         throw new HttpException(`User Sudah Verifikasi`, 401)
    //     }

    //     return await this.prismaService.user.update({
    //         where: { username },
    //         data: { token: null, isVerified: true },
    //     });
    // }

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

    async addSaldo(user: string, req): Promise<any> {

        const requestValidation = this.validationService.validate(UserValidation.SALDOUPDATE, req)

        const findUser = await this.prismaService.user.findFirst({
            where: {
                username: user
            }
        })

        if(!findUser){
            throw new HttpException(`Username ${user} tidak ditemukan`, 404)
        }

        let balance = findUser.saldo + req.saldo

        return await this.prismaService.user.update({
            where: { username: user },
            data: {saldo: balance},
        });
    }

    async getUserSaldo(user: string): Promise<any> {
        const findUser = await this.prismaService.user.findUnique({
            where: {
                username: user
            },
            select: {saldo:true}
        });
    
        if (!findUser) {
            throw new HttpException(`Username ${user} tidak ditemukan`, 404);
        }
    
        return findUser.saldo;
    }
    

    async generateQR(user: any): Promise<any> {

        const data = await this.prismaService.user.findUnique({
            where: {username: user},
            select: {username: true, saldo: true}
        })

        return this.qrcode.generateQRCode(JSON.stringify(data))
    }

    async challengeQueueEl(cara: string, arr: number[], maxIterations: number, interval: number) {
        let iterations = 0;
    
        const processQueue = () => {
            if (iterations >= maxIterations) {
                console.log("Loop selesai setelah", iterations, "iterasi");
                return; // Menghentikan loop
            }
    
            if (cara === "FIFO") {
                arr.shift(); // Menghapus elemen pertama
            } else if (cara === "LIFO") {
                arr.pop(); // Menghapus elemen terakhir
            }
    
            console.log(`Iterasi ${iterations + 1}, Data antrian: `, arr);
    
            iterations++;
            setTimeout(processQueue, interval); // Jadwalkan iterasi berikutnya
        };
    
        processQueue();
    }
}
