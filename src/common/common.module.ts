
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ValidationServie } from './validation/validation';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            level: 'debug',
            format: winston.format.json(),
            transports: [new winston.transports.Console()],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [
        PrismaService,
        ValidationServie,
    ],
    exports: [
        PrismaService,
        ValidationServie,
    ],
})
export class CommonModule { }
