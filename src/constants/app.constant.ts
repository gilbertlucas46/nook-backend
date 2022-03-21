import * as config from 'config';

export let swaggerDefaultResponseMessages = [
	{ code: 200, message: 'OK' },
	{ code: 400, message: 'Bad Request' },
	{ code: 401, message: 'Unauthorized' },
	{ code: 404, message: 'Data Not Found' },
	{ code: 500, message: 'Internal Server Error' },
];
export const PRIVILEGE = {
	SUB_ADMIN_PRIVILEGE: [0, 1, 2],  // 0, 1,   for read and write not need right now
};

export const ENUM = {
	SORT_TYPE: [1, -1],
};

export let DATABASE = {
	SUB_ADMIN_ROLES: {
		USER: 'users',
		STORY: 'story',
		ADMIN: 'admin',  // for the subAdmin roles constant
		DASHBOARD: 'dashboard',
	},
	SUB_MERCHANT_ROLES: {
		DASHBOARD: 'dashboard',
		BUSINESS: 'business',
		FAQ: 'faq',
		DEV_CENTRE: 'devCenter',
		MERCHANT_ASSISTANT: 'merchantAssistant',
		CHAT_BOT: 'chatBot',
		SUPPORT: 'support',
		SUB_MERCHANT: 'subMerchant',
		PAYMENT: 'payment',
	},

	LOAN_APPLICATION_STATUS: {
		DRAFT: {
			label: 'Draft',
			value: 'DRAFT',
		},
		NEW: {
			label: 'New',
			value: 'NEW',
		},
		NOOK_REVIEW: {
			label: 'Nook Review',
			value: 'NOOK_REVIEW',
		},
		REFERRED: {
			label: 'Referred to Bank',
			value: 'REFERRED',
		},
		BANK_APPROVED: {
			label: 'Bank Approved',
			value: 'BANK_APPROVED',
		},
		BANK_DECLINED: {
			label: 'Bank Declined',
			value: 'BANK_DECLINED',
		},
		NOOK_DECLINED: {
			label: 'Nook Declined',
			value: 'NOOK_DECLINED',
		},
		WAITING_ON_BORROWER: {
			label: 'Waiting on Borrower',
			value: 'WAITING_ON_BORROWER',
		},
		APPLICATION_WITHDRAWN: {
			label: 'Application Withdrawn',
			value: 'APPLICATION_WITHDRAWN',
		},
		PENDING_APPRAISAL: {
			label: 'Pending Appraisal',
			value: 'PENDING_APPRAISAL',
		},
		CREDIT_ASSESSMENT: {
			label: 'Credit Assessment',
			value: 'CREDIT_ASSESSMENT',
		},
		ARCHIVE: {
			label: 'Archive',
			value: 'ARCHIVE'
		},
		LOAN_BOOKED: {
			label: 'Loan Booked',
			value: 'LOAN_BOOKED'
		},
		APPROVED_AWAITING_CLIENT: {
			label: 'Approved-Awaiting Client',
			value: 'APPROVED_AWAITING_CLIENT'
		},
		INITIAL_DOCUMENTS_COMPLETED: {
			label: 'Initial Documents Completed',
			value: 'INITIAL_DOCUMENTS_COMPLETED'
		},
		FINAL_DOCUMENTS_COMPLETED: {
			label:'Final Documents Completed',
			value: 'FINAL_DOCUMENTS_COMPLETED'
		},
		AWAITING_SELLER_DEVELOPER: {
			label: 'Awaiting- Seller/Developer',
			value: 'AWAITING_SELLER_DEVELOPER'
		},
		AWAITING_PROPERTY_CONSTRUCTION: {
			label: 'Awaiting- Property Construction',
			value: 'AWAITING_PROPERTY_CONSTRUCTION'
		},
		INCOMPLETE_SUBMISSION:{
			label:"Incomplete Submission",
			value:"INCOMPLETE_SUBMISSION"
		}

	},
	EMPLOYMENT: {
		TENURE: {
			LESS_THAN_ONE: 'less_than_1',
			BETWEEN_ONE_TWO: 'between_1_2',
			BETWEEN_TWO_THREE: 'between_2_3',
			MORE_THAN_THREE: 'more_than_3',
		},
	},
	LOAN_DURATION: {
		BETWEEN_0_1: '1',
		BETWEEN_1_2: '2',
		BETWEEN_2_3: '3',
		BETWEEN_3_4: '4',
		BETWEEN_4_5: '5',
		BETWEEN_5_6: '6',
		BETWEEN_6_7: '7',
		BETWEEN_7_8: '8',
		BETWEEN_8_9: '9',
		BETWEEN_9_10: '10',
		BETWEEN_10_11: '11',
		BETWEEN_11_12: '12',
		BETWEEN_12_13: '13',
		BETWEEN_13_14: '14',
		BETWEEN_14_15: '15',
		BETWEEN_15_16: '16',
		BETWEEN_16_17: '17',
		BETWEEN_17_18: '18',
		BETWEEN_18_19: '19',
		BETWEEN_19_20: '20',
		BETWEEN_20_21: '21',
		BETWEEN_21_22: '22',
		BETWEEN_22_23: '23',
		BETWEEN_23_24: '24',
		BETWEEN_24_25: '25',
		BETWEEN_25_26: '26',
		BETWEEN_26_27: '27',
		BETWEEN_27_28: '28',
		BETWEEN_28_29: '29',
		BETWEEN_28_30: '29',
	},
	COLLATERAL: {
		DOC: {
			TYPE: {
				RESERVE_AGREEMENT: 'reservation_agreement',
				TAX_DECLARATION_1: 'tax_declaration_1',
				TAX_DECLARATION_2: 'tax_declaration_2',
				BILL_MATERIAL: 'bill_material',
				FLOOR_PLAN: 'floor_plan',

			},
		},
	},

	HOME_OWNERSHIP: {
		OWNED: 'owned',
		RENTED: 'rented',
		MORTGAGED: 'mortgaged',
		USED_FREE: 'used_free',
		LIVING_WITH_RELATIVE: 'living_with_relatives',
	},

	RELATIONSHIP: {
		BROTHER: 'brother',
		SISTER: 'sister',
		FATHER: 'father',
		MOTHER: 'mother',
		SPOUSE: 'spouse',
		SON: 'son',
		DAUGHTER: 'daughter',
		FIANCE:'fiance',
		LIFE_DOMESTIC_PARTNER:'life/domestic partner',
		'':''
	},

	CIVIL_STATUS: {
		SINGLE: 'single',
		MARRIED: 'married',
		WIDOW: 'widowed',
		SEPERATED: 'separated',
	},

	EDUCATION_BACKGROUND: {
		POST_GRAD: 'postGraduate',
		UNDER_GRAD: 'underGraduate',
		COLLEGE: 'college',
		VOCATIONAL: 'vocational',
	},

	USER_TYPE: {
		ADMIN: {
			NUMBER: 0,
			TYPE: 'ADMIN',
			DISPLAY_NAME: 'Admin',
		},
		STAFF: {
			NUMBER: 5,
			TYPE: 'STAFF',
			DISPLAY_NAME: 'Staff',
		},
	},


	ACTIONS_PERFORMED_BY_NOOK: {
		APPROVED: {
			NUMBER: 1,
			TYPE: 'APPROVED',
			DISPLAY_NAME: 'Approved',
		},
		REJECTED: {
			NUMBER: 2,
			TYPE: 'REJECTED',
			DISPLAY_NAME: 'Rejected',
		},
		BLOCKED: {
			NUMBER: 3,
			TYPE: 'BLOCKED',
			DISPLAY_NAME: 'Blocked',
		},
	},


	PERMISSION: {
		TYPE: {
			DASHBOARD: 'dashboard',
			HELP_CENTER: 'help-center',
			USERS: 'users',
			STAFF: 'staffs',
			ARTICLE: 'articles',
			LOAN: 'loans',
			Article_Category: 'article-categories',
			loanReferrals: 'loan-referrals',
			PRE_QUALIFICATION: 'pre-qualifications',
			HELPCENTER_STAFF: 'help-center-staff',
			HELPCENTER_USER: 'help-center-user',
			HELPCENTER_BANK: 'help-center-bank',
			REFERRAL_PARTNER: 'refferal-partner',
		},
	},

	ArticleCategoryStatus: {
		ACTIVE: 'Active',
		BLOCK: 'Block',
	},
	PartnerStatus: {
		ACTIVE: 'Active',
		BLOCK: 'Block',
		DELETE: 'Delete',
	},
	PREQUALIFICATION_STATUS: {
		// PENDING: 'Pending',
		ACTIVE: 'Active',
		// BLOCK: 'Block',
		DELETE: 'Delete'
	},
	ARTICLE_STATUS: {
		PENDING: 'Pending',
		ACTIVE: 'Active',
		BLOCK: 'Block',
		// BLOCKED: 'Blocked',
	},

	HELP_CENTER_CATEGORY: {
		ACCOUNT: {
			NUMBER: 1,
			TYPE: 'ACCOUNT',
			DISPLAY_NAME: 'ACCOUNT',
		},
		FAQ: {
			NUMBER: 2,
			TYPE: 'FAQ',
			DISPLAY_NAME: 'FAQ',
		},
		HOME_LOANS: {
			NUMBER: 4,
			TYPE: 'HOME_LOANS',
			DISPLAY_NAME: 'Home Loans',
		},
	},

	HELP_CENTER_TYPE: {
		STAFF_FAQ: {
			NUMBER: 1,
			TYPE: 'STAFF_FAQ',
			DISPLAY_NAME: 'Staff Faq',
		},
		BANK_FAQ: {
			NUMBER: 2,
			TYPE: 'BANK_FAQ',
			DISPLAY_NAME: 'Bank Faq',
		},
		USER_FAQ: {
			NUMBER: 3,
			TYPE: 'USER_FAQ',
			DISPLAY_NAME: 'FAQ',
		},
		// STAFF_FAQ: 'STAFF_FAQ',
		// BANK_FAQ: 'BANK_FAQ',
		// USER_FAQ: 'USER_FAQ',
	},

	HELP_CENTER_STATUS: {
		ACTIVE: 'Active',
		BLOCKED: 'Blocked',
		DELETED: 'Deleted',
	},
	HELP_CENTER_CATEGORY_STATUS: {
		ACTIVE: 'Active',
		BLOCKED: 'Blocked',
		DELETED: 'Deleted',
	},


	PRICE_LABEL: {
		DAILY: 'daily',
		WEEKLY: 'weekly',
		MONTHLY: 'monthly',
		QUATERLY: 'quarterly',
		HALFYEARLY: 'half yearly',
		YEARLY: 'yearly',
	},

	REFERRAL_STATUS: {
		ACKNOWLEDGE: 'Acknowledge',
		CONTACTED: 'Contact',
		PENDING: 'Pending',
	},

	ENQUIRY_CATEGORY: {
		SENT: 'sent',
		RECEIVED: 'received',
	},

	GENDER: {
		MALE: 'MALE',
		FEMALE: 'FEMALE',
		OTHER: 'OTHER',
	},

	LANGUAGE: {
		EN: 'en',
		MN: 'mn',
	},

	STATUS: {
		USER: {
			ACTIVE: 'ACTIVE',
			BLOCKED: 'BLOCKED',
			DELETE: 'DELETE',
		},
		ADMIN: {
			ACTIVE: 'ACTIVE',
			PENDING: 'PENDING',
			BLOCKED: 'BLOCKED',
			DELETE: 'DELETE',
		},
		LOAN_STATUS: {
			ACTIVE: 'ACTIVE',
			// BLOCKED: 'BLOCKED',
			DELETE: 'DELETE',
		},
	},

	ACTION: {
		DEEPLINK: {
			APP: 'APP',
			RESET_PASSWORD: 'RESET_PASSWORD',
			USER: 'USER',
			ADD_MEMBER: 'ADD_MEMBER',
		},
		UNDELIVERED_CHAT: {
			DELETE: 'DELETE',
			KICK: 'KICK',
			EXIT: 'EXIT',
		},
		TYPING: {
			START: 'START',
			STOP: 'STOP',
		},
		POLL: {
			UPDATE: 'UPDATE',
			VOTE: 'VOTE',
		},
		PLAN: {
			UPDATE: 'UPDATE',
			UPDATE_STATUS: 'UPDATE_STATUS',
		},
	},
	NOTIFICATION_TYPE:{
		IMAGE:'image',
		PERSONAL_DETAIL:'personal-detail',
		BOTH:'both'

	},
	NOTIFICATION_MESSAGE:{
		IMAGE_MSG:'had made the changes in Documents',
		PERSONAL_MSG:'had made the changes in Personal Detail',
		BOTH_MSG:'had made the changes in Loan Application'
	},

	RESEND_OTP_TYPE: {
		REGISTER: 'REGISTER',
		FORGOT: 'FORGOT',
	},

	BILLING_TYPE: {
		MONTHLY: 'month',
		YEARLY: 'year',
	},
	PROPERTY_CLASSIFICATION: {
		DOU:'DOU',
		REM:'REM'

	},
	 KEY_CHECK:["personalInfo","contactInfo","employmentInfo","propertyInfo","loanDetails"],
	 SUB_KEY_CHECK:[ "applicationStatus","creditCard","spouseInfo","coBorrowerInfo","prevLoans" ,"currentAddress","permanentAddress","previousAddress"],
	 DOCUMENTS_KEY_CHECK:["legalDocument","incomeDocument","colleteralDoc"]
};


export const EMAIL_TEMPLATE = {
	SOCIAL_LINK: {
		FB: 'https://www.facebook.com/NookPhilippines/',
		INSTAGRAM: 'https://www.instagram.com/nookphilippines/',
		TWITTER: 'https://twitter.com/nookphilippines',
	},
	GSG_ADDRESS: 'Appinventiv Technologies Pvt. Ltd. B-25 Nr Thomson Reuters, Sector 58, Noida, Uttar Pradesh 201301, India',
	SUBJECT: {
		FORGOT_PWD_EMAIL: 'Reset Password Request',
		RESET_PASSWORD: 'Reset password link',
		VERIFY_EMAIL: 'Verify e-mail address',
		Contact: 'Contact Enquiry Received from ',
		Enquiry: 'Property Enquiry Received from ',
	},
};
export let STATUS_MSG = {
	ERROR: {
		redirect: {
			Time_Expired: 'Time Expired',
			Already_Changed: 'Already Changed',
			Oops_Time_Expired: 'Oops Time Expired',
			invalid_Url: 'invalid Url',
		},
		ALREADY_EXIST: {
			statusCode: 400,
			type: 'ALREADY_EXIST',
			message: 'Already Exist ',
		},
		ENQUIRY_ALREADY_SENT: {
			statusCode: 400,
			type: 'ALREADY_SUBMITTED',
			message: 'Request already beeen submitted',
		},
		E406: {
			STAFF_ALREADY_LOGGED_IN: {
				statusCode: 406,
				type: 'STAFF_ALREADY_LOGGED_IN',
				message: 'Staff already logged in',
			},
		},
		E400: {
			REQUEST_ALLREDY_SENT: {
				statusCode: 400,
				type: 'REQUEST_ALLREDY_SENT',
				message: 'Request has already been sent to the admin for approval.',
			},
			INVALID_CURRENT_PASSWORD: {
				statusCode: 400,
				type: 'INVALID_CURRENT_PASSWORD',
				message: 'Password did not match with old Password',
			},
			USER_NAME_ALREDY_TAKEN: {
				statusCode: 400,
				type: 'USERNAME_ALREADY_REGISTERED',
				message: 'Entered username is already registered with us!',
			},
			EMAIL_ALREADY_TAKEN: {
				statusCode: 400,
				type: 'EMAIL_ALREADY_TAKEN',
				message: 'Entered email is already registered with us!',
			},
			REQUEST_ALREADY_SENT: {
				statusCode: 400,
				type: 'REQUEST_ALREADY_SENT',
				message: 'Staff with same email already exist!.',
			},
			DELETE_ARTICLE_FIRST: {
				statusCode: 400,
				type: 'Delete Category',
				message: 'first delete the Articles',
			},
			NOT_VERIFIED: {
				statusCode: 400,
				type: 'NOT_VERIFIED',
				message: 'You are not verified first verify.',
			},
			INVALID_EMAIL: {
				statusCode: 400,
				type: 'INVALID_EMAIL',
				message: 'Entered username/email is not registered with us!',
			},
			CANNOT_PERFORM_UPDATE_OPERATION: {
				statusCode: 400,
				type: 'CANNOT_PERFORM_UPDATE_OPERATION',
				message: 'Cannot perform update operation.',
			},
			INVALID_PASSWORD: {
				statusCode: 400,
				type: 'INVALID_PASSWORD',
				message: 'Please enter correct password!',
			},
			INVALID_LOGIN: {
				statusCode: 400,
				type: 'INVALID_LOGIN',
				message: 'Email is not registered with us!',
			},
			USER_NOT_REGISTERED: {
				statusCode: 400,
				type: 'USER_NOT_REGISTERED',
				message: 'User does not exist, please sign up.',
			},
			USER_ALREADY_EXIST: {
				statusCode: 400,
				type: 'USER_ALREADY_EXIST',
				message: 'User already exist, please login.',
			},
			VALIDATION_ERROR: {
				statusCode: 400,
				type: 'VALIDATION_ERROR',
				message: 'Validation Error',
			},
			INVALID_ID: {
				statusCode: 400,
				type: 'INVALID_ID',
				message: 'Invalid Id Provided ',
			},
			INVALID__STATUS: {
				statusCode: 400,
				type: 'INVALID__STATUS',
				message: 'Invalid Status ',
			},

			APP_ERROR: {
				statusCode: 400,
				type: 'APP_ERROR',
				message: 'Application Error',
			},
			DB_ERROR: {
				statusCode: 400,
				type: 'DB_ERROR',
				message: 'DB Error',
			},
			PAYMENT_ERROR: {
				statusCode: 400,
				type: 'PAYMENT_ERROR',
				message: 'Payment failed, please try again later!',
			},
			LOAN_TERM: {
				statusCode: 400,
				type: 'LOAN_TERM',
				message: 'Loan term not applicable',
			},
			WEBHOOK_ERROR: (error: any) => {
				return {
					statusCode: 400,
					message: `Webhook Error: ${error.message}`,
					type: 'WEBHOOK_ERROR',
				};
			},
			DEFAULT: {
				statusCode: 400,
				type: 'DEFAULT',
				message: 'Error',
			},
			CUSTOM_DEFAULT: (error: any) => {
				return {
					statusCode: 400,
					message: error,
					type: 'CUSTOM_DEFAULT',
				};
			},
			// CUSTOM_VALIDATION_ERROR: (err: any) => {
			// 	return {
			// 		statusCode: 400,
			// 		message: err,
			// 		type: 'VALIDATION_ERROR',
			// 	};
			// },
			SUBSCRIPTION_NOT_EXIST: (data: any) => {
				return {
					statusCode: 400,
					type: 'SUBSCRIPTION_NOT_EXIST',
					message: 'You do not have any subscription plan.',
					data,
				};
			},
		},
		E401: {
			// RESET_PASSWORD_EXPIRED: {
			// 	statusCode: 401,
			// 	type: 'TOKEN_EXPIRED',
			// 	message: 'Your reset password token is expired!',
			// },
			// INVALID_LINK: {
			// 	statusCode: 401,
			// 	type: 'INVALID_LINK',
			// 	message: 'Link is no more valid.',
			// },
			EMAIL_FORGET_PWD_LINK: {
				statusCode: 401,
				type: 'EMAIL_FORGET_PWD_LINK',
				message: 'Link has been expired',
			},
			INVALID_SESSION_REQUEST: {
				statusCode: 401,
				type: 'INVALID_SESSION_REQUEST',
				message: 'You have requested for an invalid login.',
			},
			TOKEN_ALREADY_EXPIRED: {
				statusCode: 401,
				type: 'TOKEN_ALREADY_EXPIRED',
				message: 'Please Login to continue.',
			},
			INVALID_TOKEN: {
				statusCode: 401,
				type: 'INVALID_TOKEN',
				message: 'Invalid token provided',
			},
			ADMIN_DELETED: {
				statusCode: 401,
				type: 'ADMIN_DELETED',
				message: 'Please contact admin regarding technical issues with your account.',
			},
			ADMIN_BLOCKED: {
				statusCode: 401,
				type: 'ADMIN_BLOCKED',
				message: 'Please contact admin regarding technical issues with your account.',
			},
			UNAUTHORIZED: {
				statusCode: 401,
				type: 'UNAUTHORIZED',
				message: 'You are not authorized to perform this action',
			},
			SUBSCRIPTION_INACTIVE: {
				statusCode: 401,
				type: 'SUNSCRIPTION',
				message: 'Subscription Not Active',
			},

			// MISSINING_AUTHENTICATION: (tokenType: any) => {
			// 	return {
			// 		statusCode: 401,
			// 		message: 'Missing authentication ' + tokenType,
			// 		type: 'MISSINING_AUTHENTICATION',
			// 	};
			// },
		},
		E404: {
			DATA_NOT_FOUND: {
				statusCode: 404,
				type: 'DATA_NOT_FOUND',
				message: 'Result not found',
			},
		},
		E422: {
			UNPROCESSABLE_ENTITY: {
				statusCode: 404,
				type: 'UNPROCESSABLE_ENTITY',
				message: 'UNPROCESSABLE_ENTITY',
			},
		},
		E500: {
			IMP_ERROR: {
				statusCode: 500,
				type: 'IMP_ERROR',
				message: 'Something went wrong, Please try again!',
			},
		},
		E501: {
			TOKENIZATION_ERROR: {
				statusCode: 501,
				type: 'TOKENIZATION_ERROR',
				message: 'Failure in creating token.',
			},
		},
	},

	SUCCESS: {
		S200: {
			REQUEST_SENT_FOR_ADDING_MEMBER: {
				statusCode: 200,
				type: 'REQUEST_SENT_FOR_ADDING_MEMBER',
				message: 'Your request for joining group has been sent.',
			},
			PHONE_VERIFIED: {
				statusCode: 200,
				type: 'PHONE_VERIFIED',
				message: 'Phone number successfully verified.',
			},
			EMAIL_VERIFIED: {
				statusCode: 200,
				type: 'EMAIL_VERIFIED',
				message: 'EMAIL  successfully verified.',
			},
			FORGET_PASSWORD: {
				statusCode: 200,
				type: 'FORGET_PASSWORD',
				message: 'Forget password successfully.',
			},
			// UPLOAD: {
			// 	statusCode: 200,
			// 	type: 'UPLOAD',
			// 	message: 'File uploaded successfully.',
			// },
			UPDATED: {
				statusCode: 200,
				type: 'UPDATED',
				message: 'Updated Successfully',
			},
			DELETED: {
				statusCode: 200,
				type: 'DELETED',
				message: 'Deleted Successfully',
			},
			BLOCKED: {
				statusCode: 200,
				type: 'BLOCKED',
				message: 'Blocked Successfully',
			},
			LOGIN: {
				statusCode: 200,
				type: 'LOGIN',
				message: 'Logged In Successfully',
			},
			LOGOUT: {
				statusCode: 200,
				type: 'LOGOUT',
				message: 'Logged Out Successfully',
			},
			DEFAULT: {
				statusCode: 200,
				type: 'DEFAULT',
				message: 'Success',
			},
			FORGET_PASSWORD_EMAIL: {
				statusCode: 200,
				type: 'FORGET_PASSWORD_EMAIL',
				message: 'Reset password link sent to email.',
			},
			ENQUIRY_SENT: {
				statusCode: 200,
				type: 'ENQUIRY_SENT',
				message: 'Enquiry Sent',
			},
			ENQUIRY_SENT_AGENT: {
				statusCode: 200,
				type: 'ENQUIRY_SENT',
				message: 'Enquiry Sent To Agent',
			},
			// LOGIN_TEST: (language: any) => {
			// 	const body = {
			// 		statusCode: 200,
			// 		message: (language === DATABASE.LANGUAGE.EN) ? 'Logged In Successfully' : 'Амжилтанд хүрсэн',
			// 		type: 'LOGIN',
			// 	};
			// 	return body;
			// },
			SUBSCRIPTION_EXIST: {
				statusCode: 200,
				type: 'SUBSCRIPTION_EXIST',
				message: 'You have successfully got one of the subscription plan.',
			},
			SUBSCRIPTION_NOT_EXIST: {
				statusCode: 200,
				type: 'SUBSCRIPTION_NOT_EXIST',
				message: 'You do not have any subscription plan.',
			},
		},
		S201: {
			CREATED: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Created Successfully',
			},
			PREQUALIFICATION_SAVED: {
				statusCode: 201,
				type: 'SAVED',
				message: 'Saved Successfully',
			},
			LOAN_REFERRAL: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Successfully send your referral to nook ',
			},
			ARTICLE_CREATED: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Article Created',
			},
			CATEGORY_CREATED: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Category Created',
			},
			PAYMENT_ADDED: {
				statusCode: 201,
				type: 'PAYMENT_ADDED',
				message: 'Payment Done Successfully',
			},
		},
		S204: {
			NO_CONTENT_AVAILABLE: {
				statusCode: 204,
				type: 'DEFAULT',
				message: 'No Data found',
			},
		},
	},

	S210: {
		FORGET_PASSWORD_PHONE_NUMBER: {
			statusCode: 210,
			type: 'FORGET_PASSWORD_PHONE_NUMBER',
			message: 'Reset otp sent to registered phone number.',
		},
	},
};

export let SERVER = {
	SELLING_ARTICLE_ID: '5df7515fd72c62a525cc9333',
	DOMAIN_NAME: 'http://localhost:7313/',
	IOS_URL: 'nook://',
	ANDROID_URL: 'http://nook.com',
	FORGET_PASSWORD_URL: '/v1/user/verifyLink/',
	ADMIN_FORGET_PASSWORD_URL: '/v1/admin/verifyLink/',

	ANDROID_PACKAGE_NAME: 'com.nook.com',
	// APP_URL: config.get('host'),
	// LINKS: {
	// 	TERMS_COND: '',
	// 	PRIVACY: config.get('host') + '/privacy_policy/',
	// },
	// SHARE_CONTENT: {
	// 	SHARE_CONTENT_MESSAGE: `Thank you for your interest in downloading Toki! We're constantly working on improving the way you can hangout with your closest friends :)`,
	// 	SHARE_CONTENT_LINK: config.get('host') + DATABASE.DEEPLINK_REDIRECT_URL.APP + 'http://nook.com' + '/' + DATABASE.ACTION.DEEPLINK.APP + '&ios=' + 'nook://' + DATABASE.ACTION.DEEPLINK.APP,
	// },
	TEMPLATE_PATH: process.cwd() + '/src/views/',
	// BY_PASS_OTP: '1212',
	// LISTNG_LIMIT: 10,
	// SYNC_LIMIT: 100000,
	// CONTACT_SYNC_LIMIT: 2000,
	// THUMB_WIDTH: 10,
	// THUMB_HEIGHT: 10,
	GIF_THUMB_WIDTH: 100,
	GIFTHUMB_HEIGHT: 100,
	CHUNK_SIZE: 100,
	LIMIT: 10,
	OTP_EXPIRATION_TIME: 15,
	TOKEN_EXPIRATION_TIME: 900,
	MAX_LIMIT: 1000,
	RANDOM_NUMBER: 4,
	HLA: 'HLA',
	PQ: 'PQ',
	LOAN_PRE__ZEOS: '000',
};

export let EMAIL_SUB: {
	RESET_PASSWORD: 'RESET PASSWORD',
};
