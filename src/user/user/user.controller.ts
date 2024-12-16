import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/users')
export class UserController {

    constructor(private userService: UserService) { }


    @Post('/create')
    async registerUser(
        @Body() request: RegisterUserRequest
    ): Promise<WebResponse<UserResponse>> {
        try {
            const result = await this.userService.registerUser(request)
            return {
                data: result
            }
        } catch (error) {

        }
    }
    
    @Post('/login')
    async loginUser(
        @Body() request: LoginUserRequest
    ): Promise<WebResponse<UserResponse>> {
        try {
            const result = await this.userService.loginUser(request)
            return {
                data: {
                    username: result.username,
                    name: result.name,
                }
            }
        } catch (error) {

        }
    }

}
