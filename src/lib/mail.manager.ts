'use strict';
import * as nodemailer from 'nodemailer';
import * as config from 'config'
import * as utils from '../utils'

export class MailManager {

    private senderEmail: string = config.get('MAIL_FROM_ADDRESS')
    constructor(private receiverEmail: string, private subject: string, private content: any) {
    }
    async sendMail() {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com", //config.get('MAIL_HOST'),
                port: 465,//config.get('MAIL_PORT'),
                // bcc: config.get('smtp.bccMail')
                secure: true, // upgrade later with STARTTLS
                auth: {
                    user: "do-not-reply@appinventiv.com", //config.get('MAIL_USERNAME'),
                    pass: "Active!@#123" //config.get('MAIL_PASSWORD')
                },
                debug: true,
                logger: true
            });

            let senderEmail = this.senderEmail
            let mailOptions = {
                from: senderEmail,// sender email
                to: this.receiverEmail, // list of receivers
                subject: this.subject, // Subject line
                text: this.content, // plain text body
                html: `<b>your OTP is  ${this.content}</b>`, // html body,              
                // bcc: config.get('smtp.bccMail')
            };
            let mailResponse = await transporter.sendMail(mailOptions);
            console.log('mailResponsemailResponse', mailResponse);

        } catch (error) {
            // utils.consolelog('MailManager', error, false)
            console.log('errorerrorerrorerror', error);

        };
        return {}
    }
}
