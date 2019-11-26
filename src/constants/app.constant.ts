import * as config from 'config';

export let swaggerDefaultResponseMessages = [
	{ code: 200, message: 'OK' },
	{ code: 400, message: 'Bad Request' },
	{ code: 401, message: 'Unauthorized' },
	{ code: 404, message: 'Data Not Found' },
	{ code: 500, message: 'Internal Server Error' },
];
export const PRIVILEGE = {
	SUB_ADMIN_PRIVILEGE: [0, 1, 2],
	SUB_MERCHANT_PRIVILEGE: [0, 1, 2],
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
		// PENDING: 'pending',
		// REJECTED: 'rejected',
		// APPROVED: 'approved',
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
			value: 'REERRED',
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
	INDUSTRY: {
		AGRI_FOREST_FISH: 'agriculture',
		ACCOMOD_FOOD_SERVICES: 'accomodation',
		ARTS_ENTERTAINMENT_RECREATION: 'arts',
		COMMUNICATION: 'communication',
		CONSTRUCTION: 'construction',
		EDUCATION: 'education',
		IT: 'it',
		OTHERS: 'others',
	},

	HOME_OWNERSHIP: {
		OWNED: 'owned',
		RENTED: 'rented',
		MORTGAGED: 'mortgaged',
		USED_FREE: 'used_free',
		LIVING_WITH_RELATIVE: 'living_with_relative',
	},

	RELATIONSHIP: {
		BROTHER: 'brother',
		SISTER: 'sister',
		FATHER: 'father',
		MOTHER: 'mother',
		SPOUSE: 'spouse',
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
		AGENT: {
			NUMBER: 1,
			TYPE: 'AGENT',
			DISPLAY_NAME: 'Agent',
		},
		TENANT: {
			NUMBER: 3,
			TYPE: 'TENANT',
			DISPLAY_NAME: 'Tenant',
		},
		OWNER: {
			NUMBER: 4,
			TYPE: 'OWNER',
			DISPLAY_NAME: 'Owner',
		},
		STAFF: {
			NUMBER: 5,
			TYPE: 'STAFF',
			DISPLAY_NAME: 'Staff',
		},
		GUEST: {
			NUMBER: 6,
			TYPE: 'GUEST',
			DISPLAY_NAME: 'Guest',
		},
	},

	PROPERTY_STATUS: {
		DRAFT: {
			NUMBER: 1,
			TYPE: 'DRAFT',
			DISPLAY_NAME: 'Draft',
		},
		PENDING: {
			NUMBER: 2,
			TYPE: 'PENDING',
			DISPLAY_NAME: 'Pending',
		},
		ACTIVE: {
			NUMBER: 3,
			TYPE: 'ACTIVE',
			DISPLAY_NAME: 'Active',
		},
		DECLINED: {
			NUMBER: 4,
			TYPE: 'DECLINED',
			DISPLAY_NAME: 'Declined',
		},
		SOLD_RENTED: {
			NUMBER: 5,
			TYPE: 'SOLD/RENTED',
			DISPLAY_NAME: 'Sold/Rented',
		},
		EXPIRED: {
			NUMBER: 6,
			TYPE: 'EXPIRED',
			DISPLAY_NAME: 'Expired',
		},
		ADMIN_PROPERTIES_LIST: {
			NUMBER: 7,
			TYPE: 'ADMIN_PROPERTY_LIST',
			DISPLAY_NAME: 'Admin Property List',
		},
		USER_PROPERTIES_LIST: {
			NUMBER: 8,
			TYPE: 'USER_PROPERTY_LIST',
			DISPLAY_NAME: 'User Property List',
		},
	},

	PROPERTY_FOR: {
		RENT: {
			NUMBER: 1,
			TYPE: 'RENT',
			DISPLAY_NAME: 'For Rent',
		},
		SALE: {
			NUMBER: 2,
			TYPE: 'SALE',
			DISPLAY_NAME: 'For Sale',
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

	PROPERTY_ACTIONS: {
		DRAFT: {
			NUMBER: 1,
			TYPE: 'DRAFT',
			DISPLAY_NAME: 'Draft',
		},
		POSTED: {
			NUMBER: 2,
			TYPE: 'POSTED',
			DISPLAY_NAME: 'Posted',
		},
		APPROVED: {
			NUMBER: 3,
			TYPE: 'APPROVED',
			DISPLAY_NAME: 'Approved',
		},
		REJECTED: {
			NUMBER: 4,
			TYPE: 'REJECTED',
			DISPLAY_NAME: 'Rejected',
		},
		BLOCKED: {
			NUMBER: 5,
			TYPE: 'BLOCKED',
			DISPLAY_NAME: 'Blocked',
		},
		SOLD_RENTED: {
			NUMBER: 6,
			TYPE: 'SOLD/RENTED',
			DISPLAY_NAME: 'Sold/Rented',
		},
		EXPIRED: {
			NUMBER: 7,
			TYPE: 'EXPIRED',
			DISPLAY_NAME: 'Expired',
		},
		PENDING: {
			NUMBER: 2,
			TYPE: 'PENDING',
			DISPLAY_NAME: 'Pending',
		},
		ISFEATURED: {
			NUMBER: 8,
			TYPE: 'ISFEATURED',
			DISPLAY_NAME: 'IsFEATURED',
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
			PROPERTIES: 'properties',
		},
	},
	PROPERTY_LABEL: {
		NONE: 'None',
		FORECLOSURE: 'Foreclosure',
		OFFICE: 'Office',
		PARKING: 'Parking',
		PRE_SELLING: 'Pre-Selling',
		READY_FOR_OCCUPANCY: 'Ready For Occupancy',
		RENT_TO_OWN: 'Rent To Own',
		RETAIL: 'Retail',
		SERVICED_OFFICE: 'Serviced Office',
		WAREHOUSE: 'Warehouse',
	},

	ARTICLE_TYPE: {
		// FEATURED_ARTICLE: {
		// 	NUMBER: 1,
		// 	TYPE: 'FEATURED_ARTICLE',
		// 	DISPLAY_NAME: 'Featured Article',
		// },
		AGENTS: {
			NUMBER: 2,
			TYPE: 'AGENTS',
			DISPLAY_NAME: 'Agent',
		},
		BUYING: {
			NUMBER: 3,
			TYPE: 'BUYING',
			DISPLAY_NAME: 'Buying',
		},
		HOME_LOANS: {
			NUMBER: 4,
			TYPE: 'HOME_LOANS',
			DISPLAY_NAME: 'Home Loans',
		},
		RENTING: {
			NUMBER: 5,
			TYPE: 'RENTING',
			DISPLAY_NAME: 'Renting',
		},
		SELLING: {
			NUMBER: 6,
			TYPE: 'SELLING',
			DISPLAY_NAME: 'Selling',
		},
		NEWS: {
			NUMBER: 7,
			TYPE: 'NEWS',
			DISPLAY_NAME: 'News',
		},
		// legal stuff, international news, domestic news, sports coverage, political news
	},

	ARTICLE_STATUS: {
		PENDING: {
			NUMBER: 1,
			TYPE: 'PENDING',
			DISPLAY_NAME: 'Pending',
		},
		ACTIVE: {
			NUMBER: 2,
			TYPE: 'ACTIVE',
			DISPLAY_NAME: 'Active',
		},
		BLOCKED: {
			NUMBER: 3,
			TYPE: 'BLOCKED',
			DISPLAY_NAME: 'Blocked',
		},
	},

	HELP_CENTER_TYPE: {
		ACCOUNT: {
			NUMBER: 1,
			TYPE: 'ACCOUNT',
			DISPLAY_NAME: 'ACCOUNT',
		},
		PROPERTIES: {
			NUMBER: 2,
			TYPE: 'PROPERTIES',
			DISPLAY_NAME: 'PROPERTIES',
		},
		BILLING: {
			NUMBER: 3,
			TYPE: 'BILLING',
			DISPLAY_NAME: 'BILLING',
		},
		HOME_LOANS: {
			NUMBER: 4,
			TYPE: 'HOME_LOANS',
			DISPLAY_NAME: 'Home Loans',
		},
	},

	PROPERTY_TYPE: {
		'NONE': 'None',
		'APPARTMENT/CONDO': 'Apartment/Condo',
		'COMMERCIAL': 'Commercial',
		'HOUSE_LOT': 'House & Lot',
		'LAND': 'Land',
		'ROOM': 'Room',
	},

	PRICE_LABEL: {
		DAILY: 'daily',
		WEEKLY: 'weekly',
		MONTHLY: 'monthly',
		QUATERLY: 'quaterly',
		HALFYEARLY: 'half yearly',
		YEARLY: 'yearly',
	},

	REFERRAL_STATUS: {
		ACKNOWLEDGE: 'Acknowledge',
		CONTACTED: 'Contact',
		PENDING: 'Pending',
	},
	// ENQUIRY_TYPE: {
	// 	GUEST: {
	// 		NUMBER: 1,
	// 		TYPE: 'GUEST',
	// 		DISPLAY_NAME: 'GUEST',
	// 	},
	// 	REGISTERED_USER: {
	// 		NUMBER: 2,
	// 		TYPE: 'REGISTERED_USER',
	// 		DISPLAY_NAME: 'Registered_User',
	// 	},
	// },
	ENQUIRY_CATEGORY: {
		SENT: 'sent',
		RECEIVED: 'received',
	},
	ENQUIRY_TYPE: {
		PROPERTY: 'property',
		CONTACT: 'contact',
	},

	ENQUIRY_STATUS: {
		PENDING: 'PENDING',
		RESOLVED: 'RESOLVED',
	},
	DEVICE_TYPES: {
		IOS: 'IOS',
		ANDROID: 'ANDROID',
		WEB: 'WEB',
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
			DELETED: 'DELETED',
		},
		ADMIN: {
			ACTIVE: 'ACTIVE',
			PENDING: 'PENDING',
			BLOCKED: 'BLOCKED',
			DELETE: 'DELETE',
		},
	},

	AGENT_SPECIALIZING: {
		LICENSED_BROKER: {
			NUMBER: 1,
			TYPE: 'LICENSED BROKER',
			DISPLAY_NAME: 'Licensed Broker',
		},
		PROPERTY_CONSULTANT: {
			NUMBER: 2,
			TYPE: 'PROPERTY_CONSULTANT',
			DISPLAY_NAME: 'Property_Consultant',
		},
		REAL_ESTATE_BROKER: {
			NUMBER: 3,
			TYPE: 'REAL_ESTATE_BROKER',
			DISPLAY_NAME: 'Real Estate Broker',
		},
		SALES_MANAGER: {
			NUMBER: 4,
			TYPE: 'SALES_MANAGER',
			DISPLAY_NAME: 'Sales Manager',
		},
	},

	ACTION:
	{
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
	RESEND_OTP_TYPE: {
		REGISTER: 'REGISTER',
		FORGOT: 'FORGOT',
	},
	MIME_TYPE: {
		DEFAULT: 'default',
		IMAGE: 'image',
		VIDEO: 'video',
		AUDIO: 'audio',
		GIF: 'gif',
		PDF: 'pdf',
		DOC: 'doc',
		DOCX: 'docx',
		XLSX: 'xlsx',
		XLS: 'xls',
		CSV: 'csv',
		TXT: 'txt',
		PPTX: 'pptx',
	},
	DEEPLINK_URL: config.get('host') + '/deeplink/',
	DEEPLINK_REDIRECT_URL: {
		APP: '/v1/deeplink?url=',
	},
};

export const EMAIL_TEMPLATE = {
	SOCIAL_LINK: {
		FB: 'https://www.facebook.com',
		INSTAGRAM: 'https://www.instagram.com',
		TWITTER: 'https://twitter.com',
	},
	GSG_ADDRESS: 'Appinventiv Technologies Pvt. Ltd. B-25 Nr Thomson Reuters, Sector 58, Noida, Uttar Pradesh 201301, India',
	SUBJECT: {
		FORGOT_PWD_EMAIL: 'Reset Password Request',
		RESET_PASSWORD: 'Reset password link',
		VERIFY_EMAIL: 'Verify e-mail address',
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
				message: 'Request has already been sent to the entered email',
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
				message: 'Entered username/email is not registered with us!',
			},
			PROPERTY_NOT_REGISTERED: {
				statusCode: 400,
				type: 'PROPERTY_NOT_REGISTERED',
				message: 'PROPERTY does not exist.',
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
			INVALID_OTP: {
				statusCode: 400,
				type: 'INVALID_OTP',
				message: 'Invalid OTP',
			},
			APP_VERSION_ERROR: {
				statusCode: 400,
				type: 'APP_VERSION_ERROR',
				message: 'One of the latest version or updated version value must be present',
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
			INVALID_PROPERTY_STATUS: {
				statusCode: 400,
				type: 'INVALID_PROPERTY_STATUS',
				message: 'Invalid Property Status ',
			},
			PROPERTY_SOLD: {
				statusCode: 400,
				type: 'PROPERTY_SOLD',
				message: 'OOPs Property Sold ',
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
			CUSTOM_VALIDATION_ERROR: (err: any) => {
				return {
					statusCode: 400,
					message: err,
					type: 'VALIDATION_ERROR',
				};
			},
		},
		E401: {
			RESET_PASSWORD_EXPIRED: {
				statusCode: 401,
				type: 'TOKEN_EXPIRED',
				message: 'Your reset password token is expired!',
			},
			INVALID_LINK: {
				statusCode: 401,
				type: 'INVALID_LINK',
				message: 'Link is no more valid.',
			},
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
				message: 'You are blocked by Admin',
			},
			ADMIN_BLOCKED: {
				statusCode: 401,
				type: 'ADMIN_BLOCKED',
				message: 'You are blocked by Admin',
			},
			UNAUTHORIZED: {
				statusCode: 401,
				type: 'UNAUTHORIZED',
				message: 'You are not authorized to perform this action',
			},
			MISSINING_AUTHENTICATION: (tokenType: any) => {
				return {
					statusCode: 401,
					message: 'Missing authentication ' + tokenType,
					type: 'MISSINING_AUTHENTICATION',
				};
			},
		},
		E404: {
			DATA_NOT_FOUND: {
				statusCode: 404,
				type: 'DATA_NOT_FOUND',
				message: 'Result not found',
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
			UPLOAD: {
				statusCode: 200,
				type: 'UPLOAD',
				message: 'File uploaded successfully.',
			},
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
			LOGIN_TEST: (language: any) => {
				const body = {
					statusCode: 200,
					message: (language === DATABASE.LANGUAGE.EN) ? 'Logged In Successfully' : 'Амжилтанд хүрсэн',
					type: 'LOGIN',
				};
				return body;
			},
		},
		S201: {
			CREATED: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Created Successfully',
			},
			LOAN_REFERRAL: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Successfully send your referral to nook ',
			},
			PROPERTY_ADDED: {
				statusCode: 201,
				type: 'PROPERTY_ADDED',
				message: 'Property Added Successfully',
			},
			ENQUIRY_SUBMITTED: {
				statusCode: 201,
				type: 'ENQUIRY_SUBMITTED',
				message: 'Enquiry Submitted',
			},
			PROPERTY_SAVE_AS_DRAFT: {
				statusCode: 201,
				type: 'PROPERTY_SAVE_AS_DRAFT',
				message: 'Property Added as Draft',
			},
			ARTICLE_CREATED: {
				statusCode: 201,
				type: 'CREATED',
				message: 'Article Created',
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
	S304: {
		GROUP_ALLREADY_EXISTS: {
			statusCode: 304,
			type: 'GROUP_ALLREADY_EXISTS',
			message: 'Similar unused group exists.',
		},
		REQUEST_EXISTS: {
			statusCode: 304,
			message: 'Friend request already Exists',
			type: 'REQUEST_EXISTS',
		},
	},
};

export let SERVER = {
	DOMAIN_NAME: 'http://localhost:7313/',
	IOS_URL: 'nook://',
	ANDROID_URL: 'http://nook.com',
	FORGET_PASSWORD_URL: '/v1/user/verifyLink/',
	ADMIN_FORGET_PASSWORD_URL: '/v1/admin/verifyLink/',

	ANDROID_PACKAGE_NAME: 'com.nook.com',
	APP_URL: config.get('host'),
	LINKS: {
		TERMS_COND: '',
		PRIVACY: config.get('host') + '/privacy_policy/',
	},
	SHARE_CONTENT: {
		SHARE_CONTENT_MESSAGE: `Thank you for your interest in downloading Toki! We're constantly working on improving the way you can hangout with your closest friends :)`,
		SHARE_CONTENT_LINK: config.get('host') + DATABASE.DEEPLINK_REDIRECT_URL.APP + 'http://nook.com' + '/' + DATABASE.ACTION.DEEPLINK.APP + '&ios=' + 'nook://' + DATABASE.ACTION.DEEPLINK.APP,
	},
	TEMPLATE_PATH: process.cwd() + '/src/views/',
	BY_PASS_OTP: '1212',
	LISTNG_LIMIT: 10,
	SYNC_LIMIT: undefined,
	CONTACT_SYNC_LIMIT: 2000,
	THUMB_WIDTH: 10,
	THUMB_HEIGHT: 10,
	GIF_THUMB_WIDTH: 100,
	GIFTHUMB_HEIGHT: 100,
	CHUNK_SIZE: 100,
	LIMIT: 10,
	OTP_EXPIRATION_TIME: 15,
	TOKEN_EXPIRATION_TIME: 900,
	MAX_LIMIT: 1000,
	RANDOM_NUMBER: 4,
	HLA: 'HLA',
	LOAN_PRE__ZEOS: '000',
};

export let EMAIL_SUB: {
	RESET_PASSWORD: 'RESET PASSWORD',
};
