import { Body, HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ValidationServie } from 'src/common/validation/validation';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        private validationService: ValidationServie,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private jwtService: JwtService  
    ){}

    async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        this.logger.info(`Register New User ${JSON.stringify(request)}`)

        const registerRequest = this.validationService.validate(UserValidation.REGISTER, request)

        const check = await this.prismaService.user.count({
            where: {
                username: request.username
            }
        })

        if(check != 0){
            throw new HttpException(`Username ${request.username} telah digunakan`, 404)
        }
            
        const hashedPW = await bcrypt.hash(registerRequest.password, 10)

        const user = await this.prismaService.user.create({
            data: {
                username: registerRequest.username,
                password: hashedPW,
                name: registerRequest.name
            }
        })
        
        return {
            username: user.username,
            name: user.name
        }
    }

    async loginUser(req: LoginUserRequest): Promise<UserResponse>{
        const user = this.validationService.validate(UserValidation.LOGIN, req)

        const findUser = await this.prismaService.user.findUnique({
            where: {
                username: req.username
            }
        })

        if(!findUser) {
            throw new HttpException(`Username ${req.username} is not found`, 404)
        }

        const token= this.jwtService.sign({
            username: user.username,
        });
          
        return {
            username: user.username,
            name: user.name,
            token: token
        } 

    }

}
