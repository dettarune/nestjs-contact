import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Prisma } from '@prisma/client';
import { ValidationServie } from './validation/validation';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
        isGlobal: true
    }),
        WinstonModule.forRoot({
            format: winston.format.json(),
            level: 'debug',
            transports: [new winston.transports.Console()]
        })
    
],
  providers: [
        PrismaService,
        ValidationServie,
    ],
    exports: [PrismaService]
})
export class CommonModule  { }
