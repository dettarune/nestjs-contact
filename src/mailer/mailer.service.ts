    import { Injectable } from '@nestjs/common';
    import * as nodemailer from 'nodemailer';
    import { EmailDTO } from 'src/model/email.model';

    @Injectable()
    export class MailerService {
        private readonly transporter: nodemailer.Transporter;


        constructor() {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                    user: process.env.EMAILTRANSPORTER,
                    pass: process.env.PASSTRANSPORTER,
                },
            });
        }

        async sendMail(target: EmailDTO, data) {
            await this.transporter.sendMail({
                from: process.env.EMAILTRANSPORTER,
                to: target.email,
                subject: `${target} !Kode Sekali Pakai : ${data}`
            })
        }

    }
