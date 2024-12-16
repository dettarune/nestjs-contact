import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Logger } from 'winston';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, string> implements OnModuleInit{
    constructor(private readonly logger: Logger){
        super({
            log: [
                {
                    emit: 'event',
                    level: 'error'
                },
                {
                    emit: 'event',
                    level: 'info'
                },{
                    emit: 'event',
                    level: 'query'
                },{
                    emit: 'event',
                    level: 'warn'
                },
            ]
        })

        console.info(`Connceting To Prisma Client`)

    }
    
    onModuleInit() {
      this.$on('info', (e) => {
        this.logger.info(e)
      })
      this.$on('query', (e) => {
        this.logger.info(e)
      })
      this.$on('warn', (e) => {
        this.logger.warn(e)
      })
      this.$on('error', (e) => {
        this.logger.error(e)
      })
    }
}
