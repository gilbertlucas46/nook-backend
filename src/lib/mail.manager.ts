// 'use strict';
// import * as nodemailer from 'nodemailer';
// import * as config from 'config'
// import { createTransport } from 'nodemailer';
// export class MailManager {

//     private senderEmail: string = config.get('smtp.from')
//     constructor(private receiverEmail: string, private subject: string, private content: any) {
//     }
//     async  sendMail() {
//         try {


//             console.log('config.get("SMTP_FROM_ADDRESS")', config.get("SMTP_FROM_ADDRESS"));

//             // const { to, html, text, subject } = payload;
//             let secure = false;
//             // if (SMTP_SSL == 'true') {
//             //     secure = true;
//             // }
//             const transporter = createTransport({
//                 host: config.get("SMTP_HOST"),
//                 port: config.get("SMTP_PORT"),
//                 secure,
//                 auth: {
//                     user: config.get("SMTP_USERNAME"),
//                     pass: config.get("SMTP_PASSWORD"),
//                 },
//                 tls: {
//                     rejectUnauthorized: false,
//                 },
//             });

//             const mailOptions = {
//                 to: this.receiverEmail,
//                 //    html,
//                 from: config.get("SMTP_FROM_ADDRESS"),
//                 text: this.content,
//                 subject: this.subject,
//             };

//             transporter.sendMail(mailOptions, (err, info) => {
//                 if (err) {
//                     console.error('err', err);
//                 } else {
//                     console.log('Mail has been sent successfully', info);
//                 }
//             });
//         } catch (error) {
//             console.log('errrorororooror', error);

//         }
//     }; 
// }



// //             let senderEmail = this.senderEmail
// //             let mailOptions = {
// //                 from: senderEmail,// sender email
// //                 to: this.receiverEmail, // list of receivers
// //                 subject: this.subject, // Subject line
// //                 html: this.content,
// //                 // bcc: config.get('smtp.bccMail')
// //             };
// //             let mailResponse = await transporter.sendMail(mailOptions)
// //             console.log('mailResponsemailResponse', mailResponse);

// //         } catch (error) {
// //             console.log("..........in mail manager............", error)
// //         };
// //         return {}
// //     }
// // }

'use strict';
import * as nodemailer from 'nodemailer';
import * as config from 'config'
import * as utils from '../utils'

export class MailManager {

    private senderEmail: string = config.get('smtp.from')
    constructor(private receiverEmail: string, private subject: string, private content: any) {
    }
    async sendMail() {
        try {
            let transporter = nodemailer.createTransport({
                host: config.get('MAIL_HOST'),
                port: config.get('MAIL_PORT'),
                secure: true, // upgrade later with STARTTLS
                auth: {
                    user: config.get('MAIL_USERNAME'),
                    pass: config.get('MAIL_PASSWORD')
                },
                // debug: true,
                // logger: true

            });
            let senderEmail = this.senderEmail
            let mailOptions = {
                from: config.get('MAIL_FROM_ADDRESS'),// sender email
                to:  "shubham.maheshwari@appinventiv.com", // list of receivers
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
