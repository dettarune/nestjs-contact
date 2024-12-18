export class RegisterUserRequest {
    username: string
    password: string
    name: string
    email: string
}

export class LoginUserRequest {
    email: string
    username: string
    password: string
}

export class UpdateUserRequest {
    username?: string
    password?: string
    name?: string
    email?: string

}

export class UserResponse {
    username: string
    name: string
    token?: string
    email?: string
    tokenVerif?: number
}









