import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { SERVER, EMAIL_TEMPLATE } from '@src/constants/app.constant';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');
import { TemplateUtil } from '@src/utils/template.util';
import { CategoryClass } from '@src/entity/article/adminArticle.entity';

const transporter = nodemailer.createTransport({

	host: config.get('smtp.mailHost'),
	port: config.get('smtp.mailPort'),
	// bcc: config.get('smtp.bccMail')
	secure: true,
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
			// let senderEmail = this.senderEmail
			const mailOptions: Mail.Options = {
				from: config.get('smtp.mailHost'), // sender email
				to: params.receiverEmail, // || this.receiverEmail,
				subject: params.subject, // || this.subject,
				// 	text: 'params.content', // || this.content,
				// html: `<b>${this.content}</b>`,    // html body
				// bcc: config.get('smtp.bccMail')
				html: params.content,    // html body
			};
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
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'welcome.html'))
				.compileFile({
					// url: url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					faceBookUrl: EMAIL_TEMPLATE.SOCIAL_LINK.FB,
					instaUrl: EMAIL_TEMPLATE.SOCIAL_LINK.INSTAGRAM,
					twitterUrl: EMAIL_TEMPLATE.SOCIAL_LINK.TWITTER,
					userName: params.userName,
				});
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
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'reset-password.html'))
				.compileFile({
					url: params.url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					// subject: params.subject,
					GSG_ADDRESS: EMAIL_TEMPLATE.GSG_ADDRESS,
					email: params.receiverEmail,
					userName: params.userName,
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'reset-password Nook ', content: mailContent });

		} catch (error) {
			return {};
		}
	}

	async contactEmail(params) {
		try {
			console.log('paramsparamsparamsparams', params);
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'contact.html'))
				.compileFile({
					name: params.name,
					address: params.address,
					description: params.message,
					phone: params.phone,
					// Id: params.propertyId, // shortId
					email: params.email,
					title: params.title,
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject, content: mailContent });
		} catch (error) {
			console.log('error>>>>>>>>>>>>>>>>>>>>>>>', error);
			return Promise.reject(error);
		}
	}

	async enquiryEmail(params) {
		try {
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'enquiry.html'))
				.compileFile({
					name: params.name,
					// address: params.address,
					description: params.message,
					phone: params.phone,
					email: params.email,
					Id: params.propertyId, // shortId
					title: params.title,
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject, content: mailContent });
		} catch (error) {
			return Promise.reject(error);
		}
	}
}
