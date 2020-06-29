import * as nodemailer from 'nodemailer';
import * as config from 'config';
import { SERVER, EMAIL_TEMPLATE } from '@src/constants/app.constant';
import * as utils from '../utils';
import Mail = require('nodemailer/lib/mailer');
import { TemplateUtil } from '@src/utils/template.util';
import { PdfGenerator } from './pdfGenerator';

const pdfClass = new PdfGenerator()

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
					nookLogoUrl: config['host'] + '/src/views/images/mobile-nook.png',
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
			let { coBorrowerInfo, spouseInfo } = params['personalInfo'];
			console.log('spouseInfospouseInfo', spouseInfo);
			let middleName = '';
			if (params['personalInfo'] && params['personalInfo']['middleName']) {
				middleName = (params['personalInfo'] && params['personalInfo']['middleName']) ? ' ' + params['personalInfo']['middleName'] : '';
			}
			console.log('middleNamemiddleNamemiddleNamemiddleName', middleName);

			let spouseMiddleName = '';
			if (params['personalInfo'] && params['personalInfo']['spouseInfo'] && params['personalInfo']['spouseInfo']['middleName']) {
				spouseMiddleName = (params['personalInfo'] && params['personalInfo']['spouseInfo']) ? ' ' + params['personalInfo']['spouseInfo']['middleName'] : '';
			}
			let coBorrowerMiddleName = '';
			console.log('spouseMiddleNamespouseMiddleNamespouseMiddleName', spouseMiddleName);
			if (coBorrowerInfo && coBorrowerInfo['middleName']) {
				coBorrowerMiddleName = ' ' + coBorrowerInfo['middleName'];
			}
			console.log('coBorrowerMiddleNamecoBorrowerMiddleName', coBorrowerMiddleName);


			let checkObjectBlank;
			if (coBorrowerInfo) {
				checkObjectBlank = (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo.employmentRank) ? true : false
				console.log('checkObjectBlankcheckObjectBlankcheckObjectBlank', checkObjectBlank);
			} else {
				coBorrowerInfo = {};
			}

			let contactPerson;
			if (params && params['documents'] && params['documents']['purchasePropertyInfo'] && params['documents']['purchasePropertyInfo']['contactPerson'] || params && params['propertyDocuments'] && params['propertyDocuments']['purchasePropertyInfo'] && params['propertyDocuments']['purchasePropertyInfo'] && params['propertyDocuments']['purchasePropertyInfo']['contactPerson']) {
				contactPerson = (params && params['documents'] && params['documents']['purchasePropertyInfo']['contactPerson']) ? params && params['documents'] && params['documents']['purchasePropertyInfo']['contactPerson'] : params['propertyDocuments']['purchasePropertyInfo']['contactPerson']
			}
			console.log('contactPersoncontactPersoncontactPerson', contactPerson);

			let contactNumber;
			if (params && params['documents'] && params['documents']['purchasePropertyInfo'] && params['documents']['purchasePropertyInfo']['contactNumber'] || params && params['propertyDocuments'] && params['propertyDocuments']['purchasePropertyInfo'] && params['propertyDocuments']['purchasePropertyInfo']['contactNumber']) {
				contactNumber = (params && params['documents'] && params['documents']['purchasePropertyInfo']['contactNumber']) ? params && params['documents'] && params['documents']['purchasePropertyInfo']['contactNumber'] : params['propertyDocuments']['purchasePropertyInfo']['contactNumber']
			}
			console.log('contactPersoncontactPersoncontactPerson', contactNumber);
			let propAddress;
			if (params && params['documents'] && params['documents']['purchasePropertyInfo'] && params['documents']['purchasePropertyInfo']['address'] || params && params['propertyDocuments'] && params['propertyDocuments']['purchasePropertyInfo'] && params['propertyDocuments']['purchasePropertyInfo']['address']) {
				propAddress = (params && params['documents'] && params['documents']['purchasePropertyInfo'] && params['documents']['purchasePropertyInfo']['address']) ? params && params['documents'] && params['documents']['purchasePropertyInfo']['contactNumber'] : params['propertyDocuments']['purchasePropertyInfo']['address']
			}
			console.log('contactPersoncontactPersoncontactPerson', contactNumber);

			console.log('>>>>>', (coBorrowerInfo && coBorrowerInfo['monthlyIncome']) ? + 'php ' + coBorrowerInfo['monthlyIncome'] : 'N/A');

			function GetFormattedDate(date) {
				const todayTime = new Date(date);
				const month = (todayTime.getMonth() + 1);
				const day = (todayTime.getDate());
				const year = (todayTime.getFullYear());
				console.log("day + ' - ' + month + ' - ' + year", day + '-' + month + '-' + year);
				return day + '-' + month + '-' + year;
			}

			const htmlContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + 'loan-form.html'))
				.compileFile({
					applicationId: params['referenceId'],
					nookLogoUrl: config['host'] + '/src/views/images/nooklogo.png',
					fullName: params['personalInfo']['firstName'] + middleName + ' ' + params['personalInfo']['lastName'],  // + params['personalInfo']['middleName'] ? params['personalInfo']['middleName'] : '' 
					civilStatus: params['personalInfo']['civilStatus'],
					sex: params['personalInfo']['gender'],
					citizenship: params['personalInfo']['nationality'],
					birthDate: params['personalInfo']['birthDate'] ? GetFormattedDate(params['personalInfo']['birthDate']) : 'N/A',

					phoneNo: params.contactInfo['phoneNumber'],
					mobileNo: params.contactInfo['mobileNumber'],

					email: params.contactInfo['email'],
					birthPlace: (params['personalInfo'] && params['personalInfo']['placeOfBirth']) ? params['personalInfo']['placeOfBirth'] : 'N/A',


					spouseFullName: (spouseInfo && spouseInfo['firstName']) ? spouseInfo['firstName'] + spouseMiddleName + ' ' + spouseInfo['lastName'] : 'N/A',
					motherMaidenName: params['personalInfo']['motherMaidenName'],
					educationBackground: params['personalInfo']['educationBackground'],
					spouseBirthDate: (spouseInfo && spouseInfo['birthDate']) ? GetFormattedDate(spouseInfo['birthDate']) : 'N/A',
					currentAddress: (params.contactInfo && params.contactInfo['currentAddress'] && params.contactInfo['currentAddress']['address']) ? params.contactInfo['currentAddress']['address'] : 'N/A',
					// permannet address

					homeOwnership1: (params.contactInfo && params.contactInfo['currentAddress'] && params.contactInfo && params.contactInfo['currentAddress']['homeOwnership']) ? params.contactInfo['currentAddress']['homeOwnership'] : 'N/A',
					permanentResidenceSince1: (params.contactInfo && params.contactInfo['currentAddress'] && params.contactInfo['currentAddress']['permanentResidenceSince']) ? params.contactInfo['currentAddress']['permanentResidenceSince'] : 'N/A',

					permanentAddress: (params.contactInfo && params.contactInfo['permanentAddress'] && params.contactInfo['permanentAddress']['address']) ? params.contactInfo['permanentAddress']['address'] : 'N/A',

					homeOwnership2: (params.contactInfo && params.contactInfo['permanentAddress'] && params.contactInfo && params.contactInfo['permanentAddress']['homeOwnership']) ? params.contactInfo['permanentAddress']['homeOwnership'] : 'N/A',

					permanentResidenceSince2: (params.contactInfo && params.contactInfo['permanentAddress'] && params.contactInfo['permanentAddress']['permanentResidenceSince']) ? params.contactInfo['permanentAddress']['permanentResidenceSince'] : 'N/A',


					previousAddress: (params.contactInfo && params.contactInfo['previousAddress'] && params.contactInfo['previousAddress']['address']) ? params.contactInfo['previousAddress']['address'] : 'N/A',

					homeOwnership3: (params.contactInfo && params.contactInfo['previousAddress'] && params.contactInfo && params.contactInfo['previousAddress']['homeOwnership']) ? params.contactInfo['previousAddress']['homeOwnership'] : 'N/A',

					permanentResidenceSince3: (params.contactInfo && params.contactInfo['previousAddress'] && params.contactInfo['previousAddress']['permanentResidenceSince']) ? params.contactInfo['previousAddress']['permanentResidenceSince'] : 'N/A',


					// CO-BORROWER’S INFORMATION
					isCoborrower: checkObjectBlank, // + ' ' + params['personalInfo']['coBorrowerInfo']['middleName']
					coBorrowerFullName: (coBorrowerInfo && coBorrowerInfo['firstName']) ? coBorrowerInfo['firstName'] + coBorrowerMiddleName + ' ' + coBorrowerInfo['lastName'] : 'N/A',
					relationship: (coBorrowerInfo && coBorrowerInfo['relationship']) ? coBorrowerInfo['relationship'] : 'N/A',
					// relationship: coBorrowerInfo ? coBorrowerInfo['relationship'] : 'N/A',
					monthlyIncome: (coBorrowerInfo && coBorrowerInfo['monthlyIncome']) ? + coBorrowerInfo['monthlyIncome'] : 'N/A',
					coBorrowerTIN: (params.employmentInfo && params.employmentInfo['coBorrowerInfo'] && params.employmentInfo['coBorrowerInfo']['tin']) ? params.employmentInfo.coBorrowerInfo['tin'] : 'N/A',
					coBorrowerSSS: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['sss']) ? params.employmentInfo.coBorrowerInfo['sss'] : 'N/A',
					coBorrowerEmploymentType: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['employmentType']) ? params.employmentInfo.coBorrowerInfo['employmentType'] : 'N/A',
					coBorrowerEmploymentRank: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['employmentRank']) ? params.employmentInfo.coBorrowerInfo['employmentRank'] : 'N/A',
					coBorrowerEmploymentTenure: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['employmentTenure']) ? params.employmentInfo.coBorrowerInfo['employmentTenure'] + ' ' + 'year' : 'N/A',
					coBorrowerCompanyName: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['companyName']) ? params.employmentInfo.coBorrowerInfo['companyName'] : 'N/A',
					coBorrowerCompanyIndustry: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['companyIndustry']) ? params.employmentInfo.coBorrowerInfo['companyIndustry'] : 'N/A',
					coBorrowerOfficePhone: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['officePhone']) ? params.employmentInfo.coBorrowerInfo['officePhone'] : 'N/A',
					coBorrowerOfficeEmail: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['officeEmail']) ? params.employmentInfo.coBorrowerInfo['officeEmail'] : 'N/A',
					coBorrowerOfficeAddress: (params.employmentInfo && params.employmentInfo.coBorrowerInfo && params.employmentInfo.coBorrowerInfo['officeAddress']) ? params.employmentInfo.coBorrowerInfo['officeAddress'] : 'N/A',

					// loan information
					bankName: params['bankInfo']['bankName'],
					loanTerm: params['loanDetails']['loanTerm'] + ' ' + 'year',
					fixedPeriod: params['loanDetails']['fixedPeriod'] + ' ' + 'year',
					loanPercent: params['loanDetails']['loanPercent'],
					loanAmount: 'php ' + params['loanDetails']['loanAmount'],
					interestRate: params['loanDetails']['rate'],
					loanType: params['loanDetails']['loanType'],
					// Loan Total PaymentA (Php): params['loanDetails']['loanAmount'],
					monthlyRepayment: (params['loanDetails']['monthlyRepayment']).toFixed(2),
					loanTotalPayment: 'N/A',


					// COLLATERAL INFORMATION
					propertyValue: 'php ' + params['propertyInfo']['value'],
					propertyType: params['propertyInfo']['type'],
					propertyStatus: params['propertyInfo']['status'],
					propertyDeveloper: params['propertyInfo']['developer'] ? params['propertyInfo']['developer'] : 'N/A',
					propertyAddress: (params && params['propertyDocuments'] && params['propertyDocuments']['purchasePropertyInfo'] && params['propertyDocuments']['purchasePropertyInfo']['address']) ? params['propertyDocuments']['purchasePropertyInfo']['address'] : 'N/A',
					isColleteralDocumentUploaded: (params && params['documents'] && params['documents']['colleteralDoc'][0]['status']) ? true : false,

					// contactPerson:
					contactNumber: (params && params['contactInfo'] && params['contactInfo']['mobileNumber']) ? params['contactInfo']['mobileNumber'] : 'N/A',


					// collateralDocStatus: params['propertyDocuments']['purchasePropertyInfo']['collateralDocStatus'],

					propcontactPerson: contactPerson ? contactPerson : 'N/A',
					propcontactNumber: contactNumber ? contactNumber : 'N/A',
					propAddress: propAddress ? propAddress : 'N/A',

					// employmentInfo
					employmentType: params['employmentInfo']['type'],
					employmentRank: params['employmentInfo']['rank'],
					employmentTenure: params['employmentInfo']['tenure'],
					grossMonthlyIncome: 'php ' + params['personalInfo']['monthlyIncome'],   // to be done
					tin: params['employmentInfo'] ? params['employmentInfo']['tin'] : 'N/A',
					sss: params['employmentInfo'] ? params['employmentInfo']['sss'] : 'N/A',
					companyName: params['employmentInfo']['companyName'],
					companyIndustry: params['employmentInfo']['companyIndustry'],
					officePhone: params['employmentInfo']['officePhone'],
					officeAddress: params['employmentInfo']['officeAddress'],
					officeEmail: params['employmentInfo']['officeEmail'],


					// LOANS AND CREDIT CARDS
					otherLoan: (params['personalInfo'] && params['personalInfo']['prevLoans']) ? params['personalInfo']['prevLoans']['status'] : 'N/A',
					totalMonthlyPayments: (params['personalInfo'] && params['personalInfo']['prevLoans'] && params['personalInfo']['prevLoans']['monthlyTotal']) ? + 'php ' + params['personalInfo']['prevLoans']['monthlyTotal'] : 'N/A',
					totalRemainingBalance: (params['personalInfo'] && params['personalInfo']['prevLoans'] && params['personalInfo']['prevLoans']['remainingTotal']) ? params['personalInfo']['prevLoans']['remainingTotal'] : 'N/A',
					//
					// Credit Card Limit (Php)


					creditCardStatus: (params['personalInfo'] && params['personalInfo']['creditCard'] && params['personalInfo']['creditCard']['status'] === 'YES') ? 'Yes ,active credit card' : 'No', // Credit Card Issuing Bank? 					,
					creditCardCancelled: (params['personalInfo'] && params['personalInfo']['creditCard'] && params['personalInfo']['creditCard']['cancelled']) ? params['personalInfo']['creditCard']['cancelled'] : 'N/A',
					// Total Monthly Payments (Php)

					// Total Remaining Balance (Php)

					creditCardLimit: (params['personalInfo'] && params['personalInfo']['creditCard'] && params['personalInfo']['creditCard']['limit']) ? params['personalInfo']['creditCard']['limit'] : 'N/A',

					creaditCardIssuingBank: 'N/A',

					//  DEPENDENTS AND REFERENCES

					name1: (params.dependentsInfo && params.dependentsInfo[0]) ? params.dependentsInfo[0].name : 'N/A',
					age1: (params.dependentsInfo && params.dependentsInfo[0]) ? params.dependentsInfo[0].age : 'N/A',
					relationship1: (params.dependentsInfo && params.dependentsInfo[0]) ? params.dependentsInfo[0].relationship : 'N/A',


					name2: (params.dependentsInfo && params.dependentsInfo[1]) ? params.dependentsInfo[1].name : 'N/A',
					age2: (params.dependentsInfo && params.dependentsInfo[1]) ? params.dependentsInfo[1].age : 'N/A',
					relationship2: (params.dependentsInfo && params.dependentsInfo[1]) ? params.dependentsInfo[1].relationship : 'N/A',


					name3: (params.dependentsInfo && params.dependentsInfo[2]) ? params.dependentsInfo[2].name : 'N/A',
					age3: (params.dependentsInfo && params.dependentsInfo[2]) ? params.dependentsInfo[2].age : 'N/A',
					relationship3: (params.dependentsInfo && params.dependentsInfo[2]) ? params.dependentsInfo[2].relationship : 'N/A',

				});

			const datatoAddInPDF = {
				applicationId: params['referenceId'],
				fullName: params['personalInfo']['firstName'] + middleName + ' ' + params['personalInfo']['lastName'],
				fileName: params['referenceId'],
				nookLogoUrl: config['host'] + '/src/views/images/nooklogo.png',
			}
			const a = await pdfClass.test(htmlContent, datatoAddInPDF);
			return a;
		} catch (error) {
			console.log('errorrrrrrrrr', error);

			return {};
		}
	}

}