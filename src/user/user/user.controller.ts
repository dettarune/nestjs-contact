import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequest, LoginUserRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { ErrorFilters } from 'src/common/error.filters';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { TokenGuard } from 'src/guard/token/token.guard';

@UseFilters(ErrorFilters)
@Controller('/api/users')
export class UserController {

    constructor(private userService: UserService
    ) { }


    @Post('/create')
    async registerUser(
        @Body() request: RegisterUserRequest,
    ): Promise<WebResponse<UserResponse>> {
        try {
            const result = await this.userService.registerUser(request)
        return {
                data: result,
        
            }
        } catch (error) {
            throw error;
        }
    }
    
    @Post('/login')
    async loginUser(
        @Body() request: LoginUserRequest,
        @Res({ passthrough: true}) res: Response
    ): Promise<WebResponse<UserResponse>> {
        try {
            const result = await this.userService.loginUser(request)

            console.info(`Message: ${result.token}`)

            res.header('token', result.token)

            return {
                data: {
                    username: result.username,
                    name: result.name,
                    token: result.token,
                    tokenVerif: result.tokenVerif
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // @Post('/verify')
    // @UseGuards(TokenGuard)
    // async verifyToken(@Req() req, @Body() tokenVerif: number): Promise<any>{
    //     const tokenJWT = req.user.username
        
    //     try {
    //         this.userService.verify(tokenJWT, tokenVerif)
    //         return {
    //             message: `User ${tokenJWT} telah berhasil verifikasi`,
    //             statusCode: 200,
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    @Post('/saldo/tambah')
    @UseGuards(TokenGuard)
    updateSaldo(
        @Body() saldo,  @Req() req
    ){
        try {

            const user = req.user.username

            this.userService.addSaldo(user, saldo)

            return { 
                message: `Success Update Saldo!`,
                jumlah: saldo,
            }
            
        } catch (error) {
           throw error 
           console.error(error.message)
        }
    }

    @Get('/saldo/:user')
    async getUserSaldo(
        @Param('user') user: string
    ){
        try {
            return `Jumlah Saldo ${user}: ${await this.userService.getUserSaldo(user)}`
        } catch (error) {
            throw new HttpException(error.message, error.status || 500); 
        }
    }

    @Get('/saldo/qr/:user')
    @UseGuards(TokenGuard)
    async getQRUser(
        @Param('user') user: string, @Req() req
    ){
        try {
            const data = req.user.username
            return await this.userService.generateQR(data)

        } catch (error) {
            throw new HttpException(error.message, error.status || 500); 
        }
    }

    @Get('challenge')
async show() {
    const arr = [1, 2, 3, 4, 5];
    const cara = "FIFO"; 
    const maxIterations = 5; 
    const interval = 2000; 

    this.userService.challengeQueueEl(cara, arr, maxIterations, interval);
    return "Loop antrian berjalan, cek log untuk detail.";
}

    @Patch()
    @UseGuards(TokenGuard)
    async updateUser(@Body() updateData: UpdateUserRequest, @Req() req){
        try {

            const userIdFromToken = req.user.username

            const result = await this.userService.update(userIdFromToken, updateData)
            return {
                data: result
            }
        } catch (error) {
            throw error
        }
    }

}
