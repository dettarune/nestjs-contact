
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ValidationServie } from './validation/validation';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilters } from './error.filters';
import { JwtModule } from '@nestjs/jwt';

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
        {
            provide: APP_FILTER,
            useClass: ErrorFilters
        }
    ],
    exports: [
        PrismaService,
        ValidationServie,
    ],
})
export class CommonModule { }
