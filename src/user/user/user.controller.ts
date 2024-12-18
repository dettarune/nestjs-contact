import { Body, Controller, Patch, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequest, LoginUserRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';
import { ErrorFilters } from 'src/common/error.filters';
import { Response } from 'express';
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
                data: result
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
                    token: result.token
                }
            }
        } catch (error) {
            throw error;
        }
    }

    @Post()
    @UseGuards(TokenGuard)
    async verifyToken(@Req() req, @Body() tokenVerif: string): Promise<any>{
        const tokenJWT = req.user.username
        try {
            
        } catch (error) {
            throw error;
        }
    }

    @Patch()
    @UseFilters(ErrorFilters)
    @UseGuards(TokenGuard)
    async updateUser(@Body() updateData: UpdateUserRequest, @Req() req){
        try {

            const userIdFromToken = req.user.username

            const result = this.userService.update(userIdFromToken, updateData)
            return {
                data: result
            }
        } catch (error) {
            throw error
        }
    }

}
