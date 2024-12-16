import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationServie {
    constructor(){}
    validate<T>(zodType: ZodType<T>, data: T):T{
        return zodType.parse(data)
    }
}
