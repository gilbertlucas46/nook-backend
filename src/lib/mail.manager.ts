import * as nodemailer from 'nodemailer';
import * as config from 'config';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');

export class MailManager {

	// private senderEmail: string = config.get('MAIL_FROM_ADDRESS')
	constructor(private receiverEmail: string, private subject: string, private content: any) {
	}
	async sendMail() {
		try {
			const transporter = nodemailer.createTransport({

				host: config.get('smtp.mailHost'), // 'smtp.gmail.com',
				port: config.get('smtp.mailPort'),
				// bcc: config.get('smtp.bccMail')
				secure: true, // upgrade later with STARTTLS
				auth: {
					user: config.get('smtp.mailUserName'),
					// ', //config.get('MAIL_USERNAME'),
					pass: config.get('smtp.mailPassword'), // '12345Appinventiv'
				},
				// debug: true,
				logger: true,
			});

			// let senderEmail = this.senderEmail
			const mailOptions: Mail.Options = {
				from: config.get('smtp.mailHost'), // sender email
				to: this.receiverEmail, // list of receivers
				subject: this.subject, // Subject line
				text: this.content, // plain text body
				html: `<b>${this.content}</b>`, // html body
				// bcc: config.get('smtp.bccMail')
			};
			await transporter.sendMail(mailOptions);
		} catch (error) {
			utils.consolelog('MailManager', error, false);
		}
		return {};
	}
}
