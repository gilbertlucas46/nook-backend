import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { SERVER, EMAIL_TEMPLATE } from '@src/constants/app.constant';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');
import { TemplateUtil } from '@src/utils/template.util';
import { PdfGenerator } from './pdfGenerator';
const transporter = nodemailer.createTransport({

	host: config.get('smtp.mailHost'),
	port: config.get('smtp.mailPort'),
	// bcc: config.get('smtp.bccMail')
	secure: false,
	auth: {
		user: config.get('smtp.mailUserName'), // config.get('MAIL_USERNAME'),
		pass: config.get('smtp.mailPassword'), // '12345Appinventiv'
	},
	// debug: true,
	// logger: true,
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
				from: 'Nook < ' + config.get('smtp.mailFromAddress') + '>', // sender email
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
					nookLogoUrl: config['host'] + '/images/mobile-nook.png',
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

	// async contactEmail(params) {
	// 	try {
	// 		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'contact.html'))
	// 			.compileFile({
	// 				// faceBookUrl: config['host'] + '/images/facebook.png',
	// 				// instaUrl: config['host'] + '/images/instagram-2.png',
	// 				// twitterUrl: config['host'] + '/images/twitter-2.png',
	// 				name: params.name,
	// 				address: params.address,
	// 				description: params.message,
	// 				phone: params.phone,
	// 				// Id: params.propertyId, // shortId
	// 				email: params.email,
	// 				title: params.title,
	// 				userName: params.firstName ? params.firstName : params.userName,
	// 				contactUrl: config.get('homePage') + '/layout/enquiries/received?type=contact',
	// 			});
	// 		await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject + params.name, content: mailContent });
	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	}
	// }

	// async enquiryEmail(params) {
	// 	try {
	// 		console.log('paramsparamsparams', params);

	// 		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'enquiry.html'))
	// 			.compileFile({
	// 				nookLogoUrl: config['host'] + '/images/nooklogo.png',
	// 				faceBookUrl: config['host'] + '/images/facebook.png',
	// 				instaUrl: config['host'] + '/images/instagram-2.png',
	// 				twitterUrl: config['host'] + '/images/twitter-2.png',

	// 				// receieverUserName: params['userName'],
	// 				receiverName: params['receiverName'] ? params['receiverName'] : params['receieverUserName'], //  params['receiverName'],
	// 				name: params.name,
	// 				// address: params.address,
	// 				description: params.message,
	// 				phone: params.phone,
	// 				email: params.email,
	// 				Id: params.propertyId, // shortId
	// 				title: params.title,
	// 				propertyUrl: params.propertyUrl,
	// 				enquiryUrl: config.get('homePage') + '/layout/enquiries/received',
	// 			});

	// 		await this.sendMail({ receiverEmail: params.receiverEmail, subject: params.subject + params.name, content: mailContent });
	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	}
	// }

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


	async generateLoanApplicationform(params) {
		try {
			console.log('paramssssssssssss', params.dependentsinfo);
			const checkObjectBlank = Object.keys(params['personalInfo']['coBorrowerInfo']).length === 0 ? false : true;

			const htmlContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'loan-form.html'))
				.compileFile({
					applicationId: params['referenceId'],
					nookLogoUrl: config['host'] + '/images/nooklogo.png',
					fullName: params['personalInfo']['firstName'] + params['personalInfo']['middleName'] ? params['personalInfo']['middleName'] : '' + params['personalInfo']['lastName'],
					civilStatus: params['personalInfo']['civilStatus'],
					sex: params['personalInfo']['gender'],
					citizenship: params['personalInfo']['nationality'],
					birthDate: new Date(params['personalInfo']['birthDate']),

					phoneNo: params.contactInfo['phoneNumber'],
					mobileNo: params.contactInfo['mobileNumber'],
					email: params.contactInfo['email'],

					spouseFullName: params['personalInfo']['spouseInfo']['firstName'] + params['personalInfo']['spouseInfo']['middleName'] ? params['personalInfo']['spouseInfo']['middleName'] : '' + params['personalInfo']['spouseInfo']['lastName'],
					motherMaidenName: params['personalInfo']['motherMaidenName'],
					educationBackground: params['personalInfo']['educationBackground'],
					spouseBirthDate: new Date(params['personalInfo']['spouseInfo']['birthDate']),
					currentAddress: params.contactInfo['currentAddress']['address'],
					// permannet address

					homeOwnership: params.contactInfo['currentAddress']['homeOwnership'],

					// CO-BORROWER’S INFORMATION
					isCoborrower: checkObjectBlank,
					coBorrowerFullName: params['personalInfo']['coBorrowerInfo']['firstName'] + '' + params['personalInfo']['coBorrowerInfo']['middleName'] ? params['personalInfo']['coBorrowerInfo']['middleName'] : '' + params['personalInfo']['coBorrowerInfo']['lastName'],
					relationship: params['personalInfo']['coBorrowerInfo']['relationship'],
					monthlyIncome: params['personalInfo']['coBorrowerInfo']['monthlyIncome'],
					coBorrowerTIN: params['personalInfo']['coBorrowerInfo']['tin'] ? params['personalInfo']['coBorrowerInfo']['tin'] : 'N/A',
					coBorrowerSSS: params['personalInfo']['coBorrowerInfo']['sss'] ? params['personalInfo']['coBorrowerInfo']['sss'] : 'N/A',
					coBorrowerEmploymentType: params['personalInfo']['coBorrowerInfo']['employmentType'] ? params['personalInfo']['coBorrowerInfo']['employmentType'] : 'N/A',
					coBorrowerEmploymentRank: params['personalInfo']['coBorrowerInfo']['employmentRank'] ? params['personalInfo']['coBorrowerInfo']['employmentRank'] : 'N/A',
					coBorrowerEmploymentTenure: params['personalInfo']['coBorrowerInfo']['employmentTenure'] ? params['personalInfo']['coBorrowerInfo']['employmentTenure'] : 'N/A',
					coBorrowerCompanyName: params['personalInfo']['coBorrowerInfo']['companyName'] ? params['personalInfo']['coBorrowerInfo']['companyName'] : 'N/A',
					coBorrowerCompanyIndustry: params['personalInfo']['coBorrowerInfo']['companyIndustry'] ? params['personalInfo']['coBorrowerInfo']['companyIndustry'] : 'N/A',
					coBorrowerOfficePhone: params['personalInfo']['coBorrowerInfo']['officePhone'] ? params['personalInfo']['coBorrowerInfo']['officePhone'] : 'N/A',
					coBorrowerOfficeEmail: params['personalInfo']['coBorrowerInfo']['officeEmail'] ? params['personalInfo']['coBorrowerInfo']['officeEmail'] : 'N/A',
					coBorrowerOfficeAddress: params['personalInfo']['coBorrowerInfo']['officeAddress'] ? params['personalInfo']['coBorrowerInfo']['officeAddress'] : 'N/A',


					// loan information
					bankName: params['bankInfo']['bankName'],
					loanTerm: params['loanDetails']['loanTerm'],
					fixedPeriod: params['loanDetails']['fixedPeriod'],
					loanPercent: params['loanDetails']['loanPercent'],
					loanAmount: params['loanDetails']['loanAmount'],
					interestRate: params['loanDetails']['rate:'],
					loanType: params['loanDetails']['loanType'],
					// Loan Total PaymentA (Php): params['loanDetails']['loanAmount'],
					monthlyRepayment: 'N/A',
					loanTotalPayment: 'N/A',


					// COLLATERAL INFORMATION
					propertyValue: params['propertyInfo']['value'],
					propertyType: params['propertyInfo']['type'],
					proeprtyStatus: params['propertyInfo']['status'],
					propertyDeveloper: params['propertyInfo']['developer'] ? params['propertyInfo']['developer'] : 'N/A',
					propertyAddress: params['propertyDocuments']['purchasePropertyInfo']['address'],
					collateralDocStatus: params['propertyDocuments']['purchasePropertyInfo']['collateralDocStatus'],

					contactPerson: params['propertyDocuments']['purchasePropertyInfo']['contactPerson'],
					contactNumber: params['propertyDocuments']['purchasePropertyInfo']['contactNumber'],


					// employmentInfo
					employmentType: params['employmentInfo']['type'],
					employmentRank: params['employmentInfo']['rank'],
					employmentTenure: params['employmentInfo']['tenure'],
					// grossMonthlyIncome:params['']
					tin: params['employmentInfo']['tin'],
					sss: params['employmentInfo']['sss'],
					companyName: params['employmentInfo']['companyName'],
					companyIndustry: params['employmentInfo']['companyIndustry'],
					officePhone: params['employmentInfo']['officePhone'],
					officeAddress: params['employmentInfo']['officeAddress'],
					officeEmail: params['employmentInfo']['officeEmail'],


					// LOANS AND CREDIT CARDS
					otherLoan: '',
					totalMonthlyPayments: '',
					//  Total Remaining Balance (Php)
					//
					// Credit Card Limit (Php)


					creditCard: '', // Credit Card Issuing Bank? 					,
					// Total Monthly Payments (Php)

					// Total Remaining Balance (Php)

					// Credit Card Limit (Php)

					// Credit Card Issuing Bank?

					//  DEPENDENTS AND REFERENCES
					dependentsinfo: params.dependentsinfo,


					// url: params.url,
					// year: new Date().getFullYear(),
					// projectName: 'Nook',
					// subject: params.subject,
					// GSG_ADDRESS: EMAIL_TEMPLATE.GSG_ADDRESS,
					// email: params.receiverEmail,
					// userName: params.firstName ? params.firstName : params.userName,
					// firstName: params.firstName,
					helpCenter: config.get('homePage') + '/help-center',
				});
			// console.log('htmlContenthtmlContenthtmlContent', htmlContent);
			console.log('htmlContenthtmlContenthtmlContent', typeof htmlContent);

			const htmlData = new PdfGenerator();
			const a = await htmlData.test(htmlContent, params['referenceId']);
			console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', a);

			return;
			// await this.sendMail({ receiverEmail: params.receiverEmail, subject: 'Password reset request', content: mailContent });

		} catch (error) {
			console.log('errorrrrrrrrr', error);

			return {};
		}
	}

}