import {IsEmail, Matches} from '@nestjs/class-validator'

export class EmailDTO {
    @IsEmail({}, { message: 'Email is not valid' }) 
    @Matches(/@gmail\.com$/, {
        message: 'Email must be from @gmail.com domain',
    })
    email: string;
}