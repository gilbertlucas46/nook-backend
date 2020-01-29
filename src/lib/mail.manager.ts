import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { SERVER, EMAIL_TEMPLATE } from '@src/constants/app.constant';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');
import { TemplateUtil } from '@src/utils/template.util';

const transporter = nodemailer.createTransport({

	host: config.get('smtp.mailHost'),
	port: config.get('smtp.mailPort'),
	// bcc: config.get('smtp.bccMail')
	secure: false,
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
				from: 'Nook < '+ config.get('smtp.mailFromAddress') +'>', // sender email
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
					faceBookUrl: config['host'] + '/images/facebook.png',
					instaUrl: config['host'] + '/images/instagram-2.png',
					twitterUrl: config['host'] + '/images/twitter-2.png',
					// faceBookUrl: EMAIL_TEMPLATE.SOCIAL_LINK.FB,
					// instaUrl: EMAIL_TEMPLATE.SOCIAL_LINK.INSTAGRAM,

					// twitterUrl: EMAIL_TEMPLATE.SOCIAL_LINK.TWITTER,
					userName: params.userName,
					password: params.password || '',

				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'Welcome To Nook', content: mailContent });

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
					nookLogoUrl: config['host'] + '/images/nooklogo.png',
					url: params.url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					// subject: params.subject,
					// GSG_ADDRESS: EMAIL_TEMPLATE.GSG_ADDRESS,
					email: params.receiverEmail,
					userName: params.firstName ? params.firstName : params.userName,
					// firstName: params.firstName,
					helpCenter: config.get('homePage') + '/help-center',
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'Password reset request', content: mailContent });

		} catch (error) {
			return {};
		}
	}

	async contactEmail(params) {
		try {
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'contact.html'))
				.compileFile({
					// faceBookUrl: config['host'] + '/images/facebook.png',
					// instaUrl: config['host'] + '/images/instagram-2.png',
					// twitterUrl: config['host'] + '/images/twitter-2.png',
					name: params.name,
					address: params.address,
					description: params.message,
					phone: params.phone,
					// Id: params.propertyId, // shortId
					email: params.email,
					title: params.title,
					userName: params.firstName ? params.firstName : params.userName,
					contactUrl: config.get('homePage') + '/layout/enquiries/received?type=contact',
				});
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject +params.name, content: mailContent });
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async enquiryEmail(params) {
		try {
			console.log('paramsparamsparams',params);
			
			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'enquiry.html'))
				.compileFile({
					nookLogoUrl: config['host'] + '/images/nooklogo.png',
					faceBookUrl: config['host'] + '/images/facebook.png',
					instaUrl: config['host'] + '/images/instagram-2.png',
					twitterUrl: config['host'] + '/images/twitter-2.png',

					// receieverUserName: params['userName'],
					receiverName: params['receiverName'] ? params['receiverName'] : params['receieverUserName'], //  params['receiverName'],
					name: params.name,
					// address: params.address,
					description: params.message,
					phone: params.phone,
					email: params.email,
					Id: params.propertyId, // shortId
					title: params.title,
					propertyUrl: params.propertyUrl,
					enquiryUrl: config.get('homePage') + '/layout/enquiries/received',
				});
				
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject + params.name , content: mailContent });
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async welcomeStaffUSer(params) {
		try {
			// let url;
			// if (params.platform && params.platform == config.CONSTANT.PLATFORM_TYPE.WEBSITE) {
			// url = config.SERVER.WEBSITE_USER_REST_URL + `${params.accessToken}`;
			// } else {
			// url = config.SERVER.USER_RESET_URL + `${params.accessToken}`;
			// }
			console.log('receiverEmailreceiverEmailreceiverEmail<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>', params);

			const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'welcome.html'))
				.compileFile({
					// url: url,
					year: new Date().getFullYear(),
					// projectName: 'Nook',
					faceBookUrl: config['host'] + '/images/facebook.png',
					instaUrl: config['host'] + '/images/instagram-2.png',
					twitterUrl: config['host'] + '/images/twitter-2.png',
					// faceBookUrl: EMAIL_TEMPLATE.SOCIAL_LINK.FB,
					// instaUrl: EMAIL_TEMPLATE.SOCIAL_LINK.INSTAGRAM,

					// twitterUrl: EMAIL_TEMPLATE.SOCIAL_LINK.TWITTER,
					userName: params.userName,
					password: params.password || '',
				});
			console.log('mailContent>>>>..', mailContent);
			await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'Welcome To Nook', content: mailContent });

		} catch (error) {
			console.log('errorerrorerrorerrorerrorerror', error);

			return {};
		}
	}
}