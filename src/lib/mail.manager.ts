'use strict';
import * as nodemailer from 'nodemailer';
import * as config from 'config';
export class MailManager {

    private senderEmail: string = config.get('MAIL_FROM_ADDRESS')
    constructor(private receiverEmail: string, private subject: string, private content: any) {
    }
    async sendMail() {
        try {
            let transporter = nodemailer.createTransport({
                host: config.get('mailHost'),
                port: config.get('mailPort'),
                // bcc: config.get('smtp.bccMail')
                secure: true, // upgrade later with START TLS
                auth: {
                    user: config.get('mailUserName'),
                    pass: config.get('mailPassword')
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
        } catch (error) {
            // utils.consolelog('MailManager', error, false)
            console.log('Error in ', error);
        };
        return {}
    }
}
