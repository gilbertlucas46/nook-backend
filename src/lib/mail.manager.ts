import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { SERVER } from '@src/constants/app.constant';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');
import { TemplateUtil } from '@src/utils/template.util';

const transporter = nodemailer.createTransport({

	host: config.get('smtp.mailHost'),         // 'smtp.gmail.com',
	port: config.get('smtp.mailPort'),
	// bcc: config.get('smtp.bccMail')
	secure: true,                              // upgrade later with STARTTLS
	auth: {
		user: config.get('smtp.mailUserName'), // config.get('MAIL_USERNAME'),
		pass: config.get('smtp.mailPassword'), // '12345Appinventiv'
	},
	debug: true,
	logger: true,
});

export class MailManager {
	// private senderEmail: string = config.get('MAIL_FROM_ADDRESS')
	// constructor(private receiverEmail: string, private subject: string, private content: any) {
	// }
	constructor() {
	}
	async sendMail(params) {
		try {
			console.log('paramsssssssssssss', params)
			// let senderEmail = this.senderEmail
			const mailOptions: Mail.Options = {
				from: config.get('smtp.mailHost'), // sender email
				to: params.receiverEmail, // || this.receiverEmail,            // list of receivers
				subject: params.subject, // || this.subject,             // Subject line
				// 	text: 'params.content', // || this.content,                // plain text body
				// html: `<b>${this.content}</b>`,    // html body
				// bcc: config.get('smtp.bccMail')
				html: params.content,    // html body
			};
			console.log('mailOptionsmailOptionsmailOptionsmailOptions', mailOptions);
			transporter.sendMail(mailOptions);
		} catch (error) {
			utils.consolelog('MailManager', error, false);
		}
		return {};
	}

	async welcomeMail(params) {
		try {
			// let url;
			// if (params.platform && params.platform == config.CONSTANT.PLATFORM_TYPE.WEBSITE) {
			// url = config.SERVER.WEBSITE_USER_REST_URL + `${params.accessToken}`;
			// } else {
			// url = config.SERVER.USER_RESET_URL + `${params.accessToken}`;
			// }
			console.log('SERVER.TEMPLATE_PATH', SERVER.TEMPLATE_PATH);

			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'welcome.html'))
				.compileFile({
					// url: url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					userName: params.userName,
				});
			// console.log('mailContentmailContentmailContentmailContentmailContent', mailContent);
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'welcome template', content: mailContent });

		} catch (error) {
			return {};
		}
	}

	async forgetPassword(params) {
		try {
			// let url;
			// if (params.platform && params.platform == config.CONSTANT.PLATFORM_TYPE.WEBSITE) {
			// url = config.SERVER.WEBSITE_USER_REST_URL + `${params.accessToken}`;
			// } else {
			// url = config.SERVER.USER_RESET_URL + `${params.accessToken}`;
			// }
			console.log('SERVER.TEMPLATE_PATH', SERVER.TEMPLATE_PATH);

			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'reset-password.html'))
				.compileFile({
					url: params.url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					email: params.receiverEmail,
					userName: params.userName,
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'reset-password Nook ', content: mailContent });

		} catch (error) {
			return {};
		}
	}
}
