import * as config from 'config';

export let swaggerDefaultResponseMessages = [
	{ code: 200, message: 'OK' },
	{ code: 400, message: 'Bad Request' },
	{ code: 401, message: 'Unauthorized' },
	{ code: 404, message: 'Data Not Found' },
	{ code: 500, message: 'Internal Server Error' },
];

export const ENUM = {
	SORT_TYPE: [1, -1],
};

export let DATABASE = {
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
		EMPLOYEE: {
			NUMBER: 5,
			TYPE: 'EMPLOYEE',
			DISPLAY_NAME: 'Employee',
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

	ENQUIRY_TYPE: {
		GUEST: {
			NUMBER: 1,
			TYPE: 'GUEST',
			DISPLAY_NAME: 'GUEST',
		},
		REGISTERED_USER: {
			NUMBER: 2,
			TYPE: 'REGISTERED_USER',
			DISPLAY_NAME: 'Registered_User',
		},
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
		MESSAGE: {
			DELIVERED: 'DELIVERED',
			SEEN: 'SEEN',
			DELETE: 'DELETE',
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
		E400: {
			REQUEST_ALLREDY_SENT: {
				statusCode: 400,
				message: 'Request has allready been sent to the admin for approval.',
				type: 'REQUEST_ALLREDY_SENT',
			},
			INVALID_CURRENT_PASSWORD: {
				statusCode: 400,
				message: 'Your Current Password did not match with new Password',
				type: 'CHANGE_PASSWORD',
			},
			USER_NAME_ALREDY_TAKEN: {
				statusCode: 400,
				message: 'This username is already taken',
				type: '',
			},
			EMAIL_ALREADY_TAKEN: {
				statusCode: 400,
				message: 'Email Address is already taken by other user',
				type: '',
			},
			NOT_VERIFIED: {
				statusCode: 400,
				message: 'You are not verified first verify.',
				type: '',
			},
			INVALID_EMAIL: {
				statusCode: 400,
				message: 'Email is not exist',
				type: '',
			},
			CANNOT_PERFORM_UPDATE_OPERATION: {
				statusCode: 400,
				message: 'Cannot perform update operation.',
				type: 'CANNOT_PERFORM_UPDATE_OPERATION',
			},

			INVALID_PASSWORD: {
				statusCode: 400,
				message: 'Please enter the valid password.',
				type: 'INVALID_USER_PASS',
			},
			INVALID_LOGIN: {
				statusCode: 400,
				type: 'INVALID_LOGIN',
				message: 'Invalid login credentials',
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
			INVALID_EMAIL_TOKEN: {
				statusCode: 400,
				type: 'INVALID_EMAIL_TOKEN',
				message: 'Wrong email token entered',
			},
			INVALID_OTP: {
				statusCode: 400,
				type: 'INVALID_OTP',
				message: 'Invalid OTP',
			},
			APP_VERSION_ERROR: {
				statusCode: 400,
				message: 'One of the latest version or updated version value must be present',
				type: 'APP_VERSION_ERROR',
			},
			VALIDATION_ERROR: {
				statusCode: 400,
				message: 'Validation Error',
				type: 'VALIDATION_ERROR',
			},
			CUSTOM_VALIDATION_ERROR: (err: any) => {
				return {
					statusCode: 400,
					message: err,
					type: 'VALIDATION_ERROR',
				};
			},
			INVALID_ID: {
				statusCode: 400,
				message: 'Invalid Id Provided ',
				type: 'INVALID_ID',
			},
			INVALID_PROPERTY_STATUS: {
				statusCode: 400,
				message: 'Invalid Property Status ',
				type: 'INVALID_PROPERTY_STATUS',
			},
			APP_ERROR: {
				statusCode: 400,
				message: 'Application Error',
				type: 'APP_ERROR',
			},
			DB_ERROR: {
				statusCode: 400,
				message: 'DB Error : ',
				type: 'DB_ERROR',
			},
			DEFAULT: {
				statusCode: 400,
				message: 'Error',
				type: 'DEFAULT',
			},
			CUSTOM_DEFAULT: (error: any) => {
				return {
					statusCode: 400,
					message: error,
					type: 'CUSTOM_DEFAULT',
				};
			},
		},
		E401: {
			RESET_PASSWORD_EXPIRED: {
				statusCode: 401,
				message: 'Your reset password token is expired!',
				type: 'TOKEN_EXPIRED',
			},
			INVALID_LINK: {
				statusCode: 401,
				message: 'Link is no more valid.',
				type: 'INVALID_LINK',
			},
			EMAIL_FORGET_PWD_LINK: {
				statusCode: 401,
				message: 'Link has been expired',
				type: 'EXPIRE_LINK',
			},
			INVALID_SESSION_REQUEST: {
				statusCode: 401,
				type: 'INVALID_SESSION_REQUEST',
				message: 'You have requested for an invalid login.',
			},
			TOKEN_ALREADY_EXPIRED: {
				statusCode: 401,
				message: 'Please Login to continue. ',
				type: 'TOKEN_ALREADY_EXPIRED',
			},
			INVALID_TOKEN: {
				statusCode: 401,
				message: 'Invalid token provided',
				type: 'INVALID_TOKEN',
			},
			ADMIN_DELETED: {
				statusCode: 401,
				message: 'You are blocked by Admin',
				type: 'ADMIN_DELETED',
			},
			ADMIN_BLOCKED: {
				statusCode: 401,
				message: 'You are blocked by Admin',
				type: 'ADMIN_BLOCKED',
			},
			UNAUTHORIZED: {
				statusCode: 401,
				message: 'You are not authorized to perform this action',
				type: 'UNAUTHORIZED',
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
			CHAT_THREAD_NOT_FOUND: {
				statusCode: 404,
				type: 'CHAT_THREAD_NOT_FOUND',
				message: 'Chat thread not found',
			},

			GROUP_NOT_FOUND: {
				statusCode: 404,
				type: 'GROUP_NOT_FOUND',
				message: 'Group not found',
			},

			DATA_NOT_FOUND: {
				statusCode: 404,
				type: 'DATA_NOT_FOUND',
				message: 'Result not found',
			},
		},
		E500: {
			IMP_ERROR: {
				statusCode: 500,
				message: 'Implementation Error',
				type: 'IMP_ERROR',
			},
		},
		E501: {
			TOKENIZATION_ERROR: {
				statusCode: 501,
				message: 'Failure in creating token.',
				type: 'TOKENIZATION_ERROR',
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
			INVITED_SUCCESSFULLY: {
				statusCode: 200,
				message: 'Contacts invited successfully',
				type: 'INVITED_SUCCESSFULLY',
			},
			PHONE_VERIFIED: {
				statusCode: 200,
				message: 'Phone number successfully verified.',
				type: 'PHONE_VERIFIED',
			},
			EMAIL_VERIFIED: {
				statusCode: 200,
				message: 'EMAIL  successfully verified.',
				type: 'EMAIL_VERIFIED',
			},
			FORGET_PASSWORD: {
				statusCode: 200,
				message: 'Forget password successfully.',
				type: 'FORGET_PASSWORD',
			},
			UPLOAD: {
				statusCode: 200,
				message: 'File uploaded successfully.',
				type: 'UPLOAD',
			},
			UPDATED: {
				statusCode: 200,
				message: 'Updated Successfully',
				type: 'UPDATED',
			},
			REPORTED: {
				statusCode: 200,
				message: 'Reported Successfully',
				type: 'REPORTED',
			},
			DELETED: {
				statusCode: 200,
				message: 'Deleted Successfully',
				type: 'DELETED',
			},
			BLOCKED: {
				statusCode: 200,
				message: 'Blocked Successfully',
				type: 'BLOCKED',
			},
			LOGIN: {
				statusCode: 200,
				message: 'Logged In Successfully',
				type: 'LOGIN',
			},
			LOGIN_TEST: (language: any) => {
				const body = {
					statusCode: 200,
					message: (language === DATABASE.LANGUAGE.EN) ? 'Logged In Successfully' : 'Амжилтанд хүрсэн',
					type: 'LOGIN',
				};
				return body;
			},
			LOGOUT: {
				statusCode: 200,
				message: 'Logged Out Successfully',
				type: 'LOGOUT',
			},
			DEFAULT: {
				statusCode: 200,
				message: 'Success',
				type: 'DEFAULT',
			},
			FORGET_PASSWORD_EMAIL: {
				statusCode: 200,
				message: 'Reset password link sent to email.',
				type: 'FORGET_PASSWORD_EMAIL',
			},
		},
		S201: {
			CREATED: {
				statusCode: 201,
				message: 'Created Successfully',
				type: 'CREATED',
			},
			PROPERTY_ADDED: {
				statusCode: 201,
				message: 'Property Added Successfully',
				type: 'CREATED',
			},
			ENQUIRY_SUBMITTED: {
				statusCode: 201,
				message: 'Enquiry Submitted',
				type: 'CREATED',
			},
		},
	},
	S210: {
		FORGET_PASSWORD_PHONE_NUMBER: {
			statusCode: 210,
			message: 'Reset otp sent to registered phone number.',
			type: 'FORGET_PASSWORD_PHONE_NUMBER',
		},
	},
	S304: {
		GROUP_ALLREADY_EXISTS: {
			statusCode: 304,
			type: 'GROUP_ALLREADY_EXISTS',
			message: 'Similar unused group exists.',
		},

		REQUEST_SENT_FOR_ADDING_MEMBER_BY_OTHER: {
			statusCode: 304,
			type: 'REQUEST_SENT_FOR_ADDING_MEMBER_BY_OTHER',
			message: 'Your request for adding the members has been sent to the admin.',
		},

		ALLREADY_FRIENDS: {
			statusCode: 304,
			message: 'You are allready friend with this user',
			type: 'ALLREADY_FRIENDS',
		},
		REQUEST_EXISTS: {
			statusCode: 304,
			message: 'Friend request already Exists',
			type: 'REQUEST_EXISTS',
		},
		NO_SUCH_REQUEST: {
			statusCode: 304,
			message: 'No such request exists.',
			type: 'NO_SUCH_REQUEST',
		},
		SOME_MEMBER_IS_BLOCKED_FROM_GROUP: {
			statusCode: 304,
			message: 'Some of the member you want to add has already blocked this group.',
			type: 'SOME_MEMBER_IS_BLOCKED_FROM_GROUP',
		},
	},
};

export let SERVER = {
	DOMAIN_NAME: 'http://localhost:7313/',
	IOS_URL: 'nook://',
	ANDROID_URL: 'http://nook.com',
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
	TEMPLATE_PATH: process.cwd() + '/views/',
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
	// TOKEN_EXPIRATION_TIME: 900,
	MAX_LIMIT: 1000,
};

export let EMAIL_SUB: {
	RESET_PASSWORD: 'RESET PASSWORD',
};
