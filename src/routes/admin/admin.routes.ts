import { ServerRoute } from 'hapi';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import { AdminProfileService, AdminService, UserService, LoanController } from '../../controllers';
import * as config from 'config';
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as Hapi from 'hapi';
import { LoanRequest } from '@src/interfaces/loan.interface';
import * as LoanConstant from '../../constants/loan.constant';
import { PreQualificationRequest } from '@src/interfaces/preQualification.interface';


const objectSchema = Joi.object({
	status: Joi.string().valid([
		LoanConstant.DocumentStatus.PENDING,
		LoanConstant.DocumentStatus.APPROVED,
		LoanConstant.DocumentStatus.REJECTED,
	]),
	documentRequired: Joi.string(),
	description: Joi.string(),
	url: Joi.string().allow(''),
});

export let adminProfileRoute: ServerRoute[] = [
	/**
	 * @description:Login via mail
	 */
	{
		method: 'POST',
		path: '/v1/admin/login',
		handler: async (request, h: Hapi.ResponseToolkit) => {
			try {
				const payload: AdminRequest.Login = request.payload as AdminRequest.Login;
				const registerResponse = await AdminProfileService.login(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'login to application',
			tags: ['api', 'anonymous', 'Admin', 'login'],
			// auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().email().lowercase().trim().required(),
					password: Joi.string().min(6).max(20).trim().required(),
				},
				// headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},

	/**
	 *
	 * @description: forget passsword to send the link over mail
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/forgetPassword',
		handler: async (request, h) => {
			try {
				const payload: UserRequest.ForgetPassword = request.payload as AdminRequest.ForgetPassword;
				await AdminProfileService.forgetPassword(payload);
				return utils.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.FORGET_PASSWORD_EMAIL, {});
			} catch (error) {
				return UniversalFunctions.sendError(error);
			}
		},
		options: {
			description: 'forget-password to admin',
			tags: ['api', 'anonymous', 'admin', 'forget-password', 'link'],
			auth: 'DoubleAuth',
			validate: {
				payload: {
					email: Joi.string().email().lowercase().trim().required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : update the admin Profile
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/profile',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.payload as AdminRequest.ProfileUpdate;
				const responseData = await AdminProfileService.editProfile(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update admin Profile',
			tags: ['api', 'anonymous', 'admin', 'update'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					name: Joi.string().min(1).max(20).trim(),
					profilePicUrl: Joi.string().allow(''),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description :Admin profile detail via token
	 */
	{
		method: 'GET',
		path: '/v1/admin/profile',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, adminData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get Admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : user verifLink for the reset-password
	 */
	{
		method: 'GET',
		path: '/v1/admin/verifyLink/{link}',
		handler: async (request, h) => {
			try {
				const payload = request.params;
				const data = await AdminProfileService.verifyLink(payload);
				return h.redirect(config.get('adminBaseUrl') + payload.link);
			} catch (error) {
				if (error.JsonWebTokenError) {
					return h.redirect(config.get('adminInvalidUrl') + 'invalid url');
				} else if (error === 'LinkExpired') {
					return h.redirect(config.get('adminInvalidUrl') + 'LinkExpired');
				} else if (error === 'error') {
					return h.redirect(config.get('adminInvalidUrl') + 'error');
				} else {
					return h.redirect(config.get('adminInvalidUrl') + 'Something went wrong');
				}
			}
		},
		options: {
			description: 'Get Admin verifylink',
			tags: ['api', 'anonymous', 'Admin', 'verifylink'],
			validate: {
				params: {
					link: Joi.string().required(),
				},
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description: Admin change passsword
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/change-password',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.ChangePassword = request.payload as AdminRequest.ChangePassword;
				const responseData = await AdminProfileService.changePassword(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Get admin Profile',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					oldPassword: Joi.string().min(6).max(16).trim(),
					newPassword: Joi.string().min(6).max(16).trim(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description : reset-password send the verify token and the password in the query
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/reset-password',
		handler: async (request, h) => {
			try {
				const payload = request.payload as AdminRequest.ResetPassword;
				const responseData = await AdminProfileService.verifyLinkForResetPwd(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, responseData));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update admin reset password',
			tags: ['api', 'anonymous', 'admin', 'reset'],
			validate: {
				payload: {
					token: Joi.string().required(),
					password: Joi.string().min(6).max(16).trim(),
				},
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},

	/**
	 * @Description:admin logout
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/logout',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.Logout = request.payload as AdminRequest.Logout;
				const registerResponse = await AdminProfileService.logout(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.LOGIN, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'logout to application',
			tags: ['api', 'anonymous', 'Admin', 'logout'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					deviceId: Joi.string(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @Description:admin dashboard
	 */
	{
		method: 'GET',
		path: '/v1/admin/dashboard',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload = request.query as any;
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.DASHBOARD);
				const registerResponse = await AdminService.dashboard(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));

			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'admin dashboard',
			tags: ['api', 'anonymous', 'Admin', 'dashboard'],
			auth: 'AdminAuth',
			validate: {
				query: {
					userGraph: Joi.number().default(new Date(new Date().getFullYear(), 0, 1).getTime()),
					preQualificationGraph: Joi.number().default(new Date(new Date().getFullYear(), 0, 1).getTime()),
					loanGraph: Joi.number().default(new Date(new Date().getFullYear(), 0, 1).getTime()),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},

	/***
	  * @description Admin loan listing
	 */
	{
		method: 'GET',
		path: '/v1/admin/loan',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: LoanRequest.IGetAdminLoanList = request.query as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);
				console.log('permissio>:::::::::::::::::::::::::::', permission);

				const registerResponse = await LoanController.adminLoansList(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin loan list',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				query: {
					status: Joi.string().valid([
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,

						Constant.DATABASE.LOAN_APPLICATION_STATUS.APPLICATION_WITHDRAWN.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.CREDIT_ASSESSMENT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.WAITING_ON_BORROWER.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING_APPRAISAL.value,

					]),
					amountFrom: Joi.number(),
					amountTo: Joi.number(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					sortBy: Joi.string().default('createdAt'),
					limit: Joi.number(),
					page: Joi.number().min(1).default(1),
					// type: Joi.string().valid('admin', 'user')
					searchTerm: Joi.string(),
					staffId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
					partnerName: Joi.string(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/***
	*@description : admin update the loan status
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/loan',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: AdminRequest.IUpdateLoanRequest = request.query as any;
				// {
				// 	// ...request.query as any,
				// 	...request.params,
				// }
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }

				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);

				const registerResponse = await LoanController.adminUpdateLoanStatus(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				query: {
					loanId: Joi.string().required(),
					status: Joi.string().valid([
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.REJECTED,
						// Constant.DATABASE.LOAN_APPLICATION_STATUS.APPROVED,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,

						Constant.DATABASE.LOAN_APPLICATION_STATUS.WAITING_ON_BORROWER.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.APPLICATION_WITHDRAWN.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.CREDIT_ASSESSMENT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.PENDING_APPRAISAL.value,
						'',
					]),
					staffId: Joi.string(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/***
	 *@description : admin get the loan
	 */
	{
		method: 'GET',
		path: '/v1/admin/loan/{loanId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: LoanRequest.LoanById = request.params as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await AdminStaffEntity.checkPermission(payload.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);
				console.log('permissio>:::::::::::::::::::::::::::', permission);


				const registerResponse = await LoanController.loanById(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, registerResponse));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin update loan status',
			tags: ['api', 'anonymous', 'admin', 'loan', 'status'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},

	/**
	 * @description admin preQualification banks list
	 */
	{
		method: 'GET',
		path: '/v1/admin/prequalification',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: PreQualificationRequest.IAdminPrequalificationList = request.query as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION);
				const data = await LoanController.preQualificationList(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin preQualification bank list',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				query: {
					// userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					page: Joi.number(),
					limit: Joi.number(),
					fromDate: Joi.number(),
					toDate: Joi.number(),
					sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]).default(-1),
					propertyValue: Joi.number(),
					propertyType: Joi.string(),
					searchTerm: Joi.string(),
					partnerName: Joi.string(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},

	/**
	 * @description subscription list
	 */
	{
		method: 'GET',
		path: '/v1/admin/prequalification/{id}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: PreQualificationRequest.IprequalificationDetail = request.params as any;
				// if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
				// 	await ENTITY.AdminStaffEntity.checkPermission(adminData.permission);
				// }
				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION);

				const data = await LoanController.preQualificationDetail(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
			} catch (error) {
				utils.consolelog('Error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'Admin preQualification by Id',
			tags: ['api', 'anonymous', 'admin', 'Detail'],
			auth: 'AdminAuth',
			validate: {
				params: {
					id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description update the loan by admin
	 */

	{
		method: 'PATCH',
		path: '/v1/admin/loan/{loanId}',
		handler: async (request, h: Hapi.ResponseToolkit) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				console.log('adminData><<<<<<<<<<<', adminData);

				// const payload =
				// const loanId =
				const payload = {
					...request.payload as any,
					...request.params as any,
				};
				console.log('payload', payload);
				const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);
				console.log('permissio>:::::::::::::::::::::::::::', permission);

				const data = await LoanController.adminUpdateLoanApplication(payload, adminData);
				console.log('datadatadatadatadata', data);

				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'update Loan Application',
			tags: ['api', 'anonymous', 'loan', 'update'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					assignedTo: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
					userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
						placeOfBirth: Joi.string(),
						nationality: Joi.string(),
						localVisa: Joi.boolean(),
						creditCard: Joi.object({
							status: Joi.string(),
							limit: Joi.number(),
							cancelled: Joi.boolean(),
						}),
						prevLoans: Joi.object({
							status: Joi.boolean(),
							monthlyTotal: Joi.number(),
							remainingTotal: Joi.number(),
						}),
						gender: Joi.string().valid([
							LoanConstant.GENDER.MALE.value,
							LoanConstant.GENDER.FEMALE.value,
							LoanConstant.GENDER.OTHER.value,
							//   DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.OTHER,
						]),
						educationBackground: Joi.string().valid([
							Constant.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
							Constant.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
						]),
						civilStatus: Joi.string().valid([
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.number(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
						},
						coBorrowerInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.number(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							relationship: Joi.string().valid([
								Constant.DATABASE.RELATIONSHIP.BROTHER,
								Constant.DATABASE.RELATIONSHIP.FATHER,
								Constant.DATABASE.RELATIONSHIP.MOTHER,
								Constant.DATABASE.RELATIONSHIP.SISTER,
								Constant.DATABASE.RELATIONSHIP.SPOUSE,
								Constant.DATABASE.RELATIONSHIP.SON,
								Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							]),
						},
					}),

					propertyInfo: {
						value: Joi.number(),
						type: Joi.string(),
						status: Joi.string(),
						developer: Joi.string().allow(''),
					},
					bankInfo: Joi.object().keys({
						iconUrl: Joi.string(),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),
					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(7).max(15),
						currentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
							permanentResidenceSince: Joi.number(),
						}),
						permanentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
							permanentResidenceSince: Joi.number(),
						}),
						previousAddress: Joi.object().keys({
							address: Joi.string().max(300).trim(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
							permanentResidenceSince: Joi.number(),
						}),
						// mailingAddress: {
						// 	permanentAddress: Joi.boolean(),
						// 	presentAddress: Joi.boolean(),
						// },
						// // { type: Boolean, enum: ['Permanent Address', 'Present Address'] },
						// address: {
						// 	permanentAddress: {
						// 		address: Joi.string(),
						// 		homeOwnership: Joi.string().valid([
						// 			Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
						// 			Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.OWNED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.RENTED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
						// 		]),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// 	presentAddress: {
						// 		address: Joi.string(),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// },
					}),

					loanDetails: Joi.object().keys({
						maxLoanTerm: Joi.number(),
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string().valid([
							LoanConstant.LOAN_TYPES.CONSTRUCTION.value,
							LoanConstant.LOAN_TYPES.LOAN_TAKE_OUT.value,
							LoanConstant.LOAN_TYPES.PURCHASE_OF_PROPERTY.value,
							// LoanConstant.LOAN_TYPES.REFINANCING_LOAN.value,
							LoanConstant.LOAN_TYPES.RENOVATION.value,
							LoanConstant.LOAN_TYPES.REFINANCING.value,
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,
						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
						propertyValue: Joi.number(),
					}),

					employmentInfo: Joi.object().keys({
						type: Joi.string(),
						rank: Joi.string(),
						tenure: Joi.string(),
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							LoanConstant.INDUSTRIES.AGRI_FOREST_FISH.value,
							LoanConstant.INDUSTRIES.ADVERTISING.value,
							LoanConstant.INDUSTRIES.BUSINESS_INFORMATION.value,
							LoanConstant.INDUSTRIES.CONST_UTIL_CONTRACT.value,
							LoanConstant.INDUSTRIES.EDUCATION.value,
							LoanConstant.INDUSTRIES.ENTERTAINMENT_FASHION.value,
							LoanConstant.INDUSTRIES.FINANCE_INSURANCE.value,
							LoanConstant.INDUSTRIES.FOOD_HOSPITALITY.value,
							LoanConstant.INDUSTRIES.GAMING.value,
							LoanConstant.INDUSTRIES.HEALTH_SERVICES.value,
							LoanConstant.INDUSTRIES.INFORMATION_TECHNOLOGY.value,
							LoanConstant.INDUSTRIES.MANUFACTURING.value,
							LoanConstant.INDUSTRIES.MOTOR_VEHICLE.value,
							LoanConstant.INDUSTRIES.MUSIC_MEDIA.value,
							LoanConstant.INDUSTRIES.NATURAL_RES_ENV.value,
							LoanConstant.INDUSTRIES.OTHER.value,
							LoanConstant.INDUSTRIES.PERSONAL_SERVICES.value,
							LoanConstant.INDUSTRIES.REAL_ESTATE_HOUSING.value,
							LoanConstant.INDUSTRIES.RETAIL.value,
							LoanConstant.INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
							LoanConstant.INDUSTRIES.TRANSPORTATION.value,
						]),
						grossMonthlyIncome: Joi.string(),
						provinceState: Joi.string(),
						country: Joi.string(),
						coBorrowerInfo: {
							employmentType: Joi.string().valid([
								LoanConstant.EMPLOYMENT_TYPE.BPO.value,
								LoanConstant.EMPLOYMENT_TYPE.GOVT.value,
								LoanConstant.EMPLOYMENT_TYPE.OFW.value,
								LoanConstant.EMPLOYMENT_TYPE.PRIVATE.value,
								LoanConstant.EMPLOYMENT_TYPE.PROFESSIONAL.value,
								LoanConstant.EMPLOYMENT_TYPE.SELF.value,
							]),
							tin: Joi.string(),
							companyName: Joi.string(),
							sss: Joi.string(),
							employmentRank: Joi.string().valid([
								LoanConstant.EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.CHAIRMAN.value,
								LoanConstant.EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
								LoanConstant.EMPLOYMENT_RANK.CLERK.value,
								LoanConstant.EMPLOYMENT_RANK.DIRECTOR.value,
								LoanConstant.EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
								LoanConstant.EMPLOYMENT_RANK.MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
								LoanConstant.EMPLOYMENT_RANK.OWNER.value,
								LoanConstant.EMPLOYMENT_RANK.PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.PROFESSIONAL.value,
								LoanConstant.EMPLOYMENT_RANK.RANK_FILE.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.SUPERVISOR.value,
								LoanConstant.EMPLOYMENT_RANK.VICE_PRESIDENT.value,
							]),
							employmentTenure: Joi.string().valid(Object.keys(LoanConstant.EMPLOYMENT_TENURE)),
							companyIndustry: Joi.string().valid([
								LoanConstant.INDUSTRIES.AGRI_FOREST_FISH.value,
								LoanConstant.INDUSTRIES.ADVERTISING.value,
								LoanConstant.INDUSTRIES.BUSINESS_INFORMATION.value,
								LoanConstant.INDUSTRIES.CONST_UTIL_CONTRACT.value,
								LoanConstant.INDUSTRIES.EDUCATION.value,
								LoanConstant.INDUSTRIES.ENTERTAINMENT_FASHION.value,
								LoanConstant.INDUSTRIES.FINANCE_INSURANCE.value,
								LoanConstant.INDUSTRIES.FOOD_HOSPITALITY.value,
								LoanConstant.INDUSTRIES.GAMING.value,
								LoanConstant.INDUSTRIES.HEALTH_SERVICES.value,
								LoanConstant.INDUSTRIES.INFORMATION_TECHNOLOGY.value,
								LoanConstant.INDUSTRIES.MANUFACTURING.value,
								LoanConstant.INDUSTRIES.MOTOR_VEHICLE.value,
								LoanConstant.INDUSTRIES.MUSIC_MEDIA.value,
								LoanConstant.INDUSTRIES.NATURAL_RES_ENV.value,
								LoanConstant.INDUSTRIES.OTHER.value,
								LoanConstant.INDUSTRIES.PERSONAL_SERVICES.value,
								LoanConstant.INDUSTRIES.REAL_ESTATE_HOUSING.value,
								LoanConstant.INDUSTRIES.RETAIL.value,
								LoanConstant.INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
								LoanConstant.INDUSTRIES.TRANSPORTATION.value,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
							grossMonthlyIncome: Joi.string(),
							provinceState: Joi.string(),
							country: Joi.string(),
						},
					}),
					dependentsInfo: Joi.array().items({
						name: Joi.string(),
						age: Joi.number(),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
						]),
					}),
					tradeReferences: Joi.array().items({
						companyName: Joi.string(),
						type: Joi.string().valid([
							LoanConstant.TRADE_REFERENCE.CUSTOMER,
							LoanConstant.TRADE_REFERENCE.SUPPLIER,
						]),
						contactPerson: Joi.string(),
						contactNumber: Joi.string(),
						position: Joi.string(),
					}),

					// propertyDocuments: Joi.object().keys({
					// 	borrowerValidDocIds: Joi.array().items(Joi.string()),
					// 	coBorrowerValidId: Joi.array().items(Joi.string()),
					// 	latestITR: Joi.string().uri(),
					// 	employmentCert: Joi.string().uri(),
					// 	purchasePropertyInfo: Joi.object().keys({
					// 		address: Joi.string().max(300),
					// 		contactPerson: Joi.string(),
					// 		contactNumber: Joi.number(),
					// 		collateralDocStatus: Joi.boolean(),
					// 		collateralDocList: Joi.array().items({
					// 			docType: Joi.string().valid([
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
					// 			]),
					// 			docUrl: Joi.string(),
					// 		}),
					// 	}),
					// 	nookAgent: Joi.string(),
					// }),
					documents: {
						legalDocument: Joi.array().items(objectSchema),
						incomeDocument: Joi.array().items(objectSchema),
						colleteralDoc: Joi.array().items(objectSchema),
					},
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},


	{
		method: 'POST',
		path: '/v1/admin/loan/application',
		handler: async (request, h: Hapi.ResponseToolkit) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				const payload: LoanRequest.AddLoan = request.payload as any;

				const data = await LoanController.addLoanApplication(payload, adminData);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data));
			} catch (error) {
				UniversalFunctions.consolelog(error, 'error', true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'add Loan Requirements',
			tags: ['api', 'anonymous', 'loan', 'Add'],
			auth: 'AdminAuth',
			validate: {
				payload: {
					assignedTo: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/),
					userId: Joi.string(),  // in case of admin only
					personalInfo: Joi.object().keys({
						firstName: Joi.string().min(1).max(32).required(),
						lastName: Joi.string().min(1).max(32),
						middleName: Joi.string().max(32).allow(''),
						monthlyIncome: Joi.number(),
						otherIncome: Joi.number(),
						motherMaidenName: Joi.string(),
						birthDate: Joi.number(),
						placeOfBirth: Joi.string(),
						nationality: Joi.string(),
						localVisa: Joi.boolean(),
						creditCard: Joi.object({
							status: Joi.string(),
							limit: Joi.number(),
							cancelled: Joi.boolean(),
						}),
						prevLoans: Joi.object({
							status: Joi.boolean(),
							monthlyTotal: Joi.number(),
							remainingTotal: Joi.number(),
						}),
						gender: Joi.string().valid([
							LoanConstant.GENDER.MALE.value,
							LoanConstant.GENDER.FEMALE.value,
							LoanConstant.GENDER.OTHER.value,
							//   DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.FEMALE,
							// Constant.DATABASE.GENDER.OTHER,
						]),
						educationBackground: Joi.string().valid([
							Constant.DATABASE.EDUCATION_BACKGROUND.POST_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.UNDER_GRAD,
							Constant.DATABASE.EDUCATION_BACKGROUND.COLLEGE,
							Constant.DATABASE.EDUCATION_BACKGROUND.VOCATIONAL,
						]),
						civilStatus: Joi.string().valid([
							Constant.DATABASE.CIVIL_STATUS.SINGLE,
							Constant.DATABASE.CIVIL_STATUS.WIDOW,
							Constant.DATABASE.CIVIL_STATUS.SEPERATED,
							Constant.DATABASE.CIVIL_STATUS.MARRIED,
						]),
						spouseInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.number(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							motherMaidenName: Joi.string(),
							age: Joi.number(),
							birthPlace: Joi.string(),
						},
						coBorrowerInfo: {
							firstName: Joi.string().max(32),
							lastName: Joi.string().max(32),
							middleName: Joi.string().max(32),
							birthDate: Joi.number(),
							monthlyIncome: Joi.number(),
							isCoborrower: Joi.boolean(),
							relationship: Joi.string().valid([
								Constant.DATABASE.RELATIONSHIP.BROTHER,
								Constant.DATABASE.RELATIONSHIP.FATHER,
								Constant.DATABASE.RELATIONSHIP.MOTHER,
								Constant.DATABASE.RELATIONSHIP.SISTER,
								Constant.DATABASE.RELATIONSHIP.SPOUSE,
								Constant.DATABASE.RELATIONSHIP.SON,
								Constant.DATABASE.RELATIONSHIP.DAUGHTER,
							]),
							age: Joi.number(),
							birthPlace: Joi.string(),
							motherMaidenName: Joi.string(),
						},
					}),

					propertyInfo: {
						value: Joi.number(),
						type: Joi.string(),
						status: Joi.string(),
						developer: Joi.string().allow(''),
					},

					applicationStatus: Joi.string().valid([
						Constant.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
					]).default(Constant.DATABASE.LOAN_APPLICATION_STATUS.NEW.value),
					bankInfo: Joi.object().keys({
						iconUrl: Joi.string().allow(''),
						bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
						bankName: Joi.string().min(5).max(50),
						abbrevation: Joi.string().max(10),
					}),

					contactInfo: Joi.object().keys({
						phoneNumber: Joi.string(),
						email: Joi.string().email(),
						mobileNumber: Joi.string().min(7).max(15),
						currentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]).required(),
							permanentResidenceSince: Joi.number(),
						}),
						permanentAddress: Joi.object().keys({
							address: Joi.string().max(300),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
							permanentResidenceSince: Joi.number(),
						}),
						previousAddress: Joi.object().keys({
							address: Joi.string().max(300).trim(),
							homeOwnership: Joi.string().valid([
								Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
								Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
								Constant.DATABASE.HOME_OWNERSHIP.OWNED,
								Constant.DATABASE.HOME_OWNERSHIP.RENTED,
								Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
							]),
							permanentResidenceSince: Joi.number(),
						}),
						// mailingAddress: {
						// 	permanentAddress: Joi.boolean(),
						// 	presentAddress: Joi.boolean(),
						// },
						// // { type: Boolean, enum: ['Permanent Address', 'Present Address'] },
						// address: {
						// 	permanentAddress: {
						// 		address: Joi.string(),
						// 		homeOwnership: Joi.string().valid([
						// 			Constant.DATABASE.HOME_OWNERSHIP.LIVING_WITH_RELATIVE,
						// 			Constant.DATABASE.HOME_OWNERSHIP.MORTGAGED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.OWNED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.RENTED,
						// 			Constant.DATABASE.HOME_OWNERSHIP.USED_FREE,
						// 		]),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// 	presentAddress: {
						// 		address: Joi.string(),
						// 		lengthOfStay: Joi.number(),
						// 	},
						// },
					}),

					loanDetails: Joi.object().keys({
						maxLoanTerm: Joi.number(),
						fixedPeriod: Joi.number(),
						loanTerm: Joi.number(),
						rate: Joi.number().max(100),
						monthlyRepayment: Joi.number(),
						hasCoBorrower: Joi.boolean(),
						loanType: Joi.string().valid([
							LoanConstant.LOAN_TYPES.CONSTRUCTION.value,
							LoanConstant.LOAN_TYPES.LOAN_TAKE_OUT.value,
							LoanConstant.LOAN_TYPES.PURCHASE_OF_PROPERTY.value,
							// LoanConstant.LOAN_TYPES.REFINANCING_LOAN.value,
							LoanConstant.LOAN_TYPES.RENOVATION.value,
							LoanConstant.LOAN_TYPES.REFINANCING.value,
							// LoanConstant.LOAN_TYPES.NEW_CONSTRUCTION.value,

						]),
						loanPercent: Joi.number(),
						loanAmount: Joi.number(),
					}),

					employmentInfo: Joi.object().keys({
						type: Joi.string(),
						rank: Joi.string(),
						tenure: Joi.string(),
						tin: Joi.string(),
						companyName: Joi.string().min(1).max(300),
						sss: Joi.string(),
						officePhone: Joi.string(),
						officeEmail: Joi.string(),
						officeAddress: Joi.string().max(300),
						companyIndustry: Joi.string().valid([
							LoanConstant.INDUSTRIES.AGRI_FOREST_FISH.value,
							LoanConstant.INDUSTRIES.ADVERTISING.value,
							LoanConstant.INDUSTRIES.BUSINESS_INFORMATION.value,
							LoanConstant.INDUSTRIES.CONST_UTIL_CONTRACT.value,
							LoanConstant.INDUSTRIES.EDUCATION.value,
							LoanConstant.INDUSTRIES.ENTERTAINMENT_FASHION.value,
							LoanConstant.INDUSTRIES.FINANCE_INSURANCE.value,
							LoanConstant.INDUSTRIES.FOOD_HOSPITALITY.value,
							LoanConstant.INDUSTRIES.GAMING.value,
							LoanConstant.INDUSTRIES.HEALTH_SERVICES.value,
							LoanConstant.INDUSTRIES.INFORMATION_TECHNOLOGY.value,
							LoanConstant.INDUSTRIES.MANUFACTURING.value,
							LoanConstant.INDUSTRIES.MOTOR_VEHICLE.value,
							LoanConstant.INDUSTRIES.MUSIC_MEDIA.value,
							LoanConstant.INDUSTRIES.NATURAL_RES_ENV.value,
							LoanConstant.INDUSTRIES.OTHER.value,
							LoanConstant.INDUSTRIES.PERSONAL_SERVICES.value,
							LoanConstant.INDUSTRIES.REAL_ESTATE_HOUSING.value,
							LoanConstant.INDUSTRIES.RETAIL.value,
							LoanConstant.INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
							LoanConstant.INDUSTRIES.TRANSPORTATION.value,
						]),
						coBorrowerInfo: {
							employmentType: Joi.string().valid([
								LoanConstant.EMPLOYMENT_TYPE.BPO.value,
								LoanConstant.EMPLOYMENT_TYPE.GOVT.value,
								LoanConstant.EMPLOYMENT_TYPE.OFW.value,
								LoanConstant.EMPLOYMENT_TYPE.PRIVATE.value,
								LoanConstant.EMPLOYMENT_TYPE.PROFESSIONAL.value,
								LoanConstant.EMPLOYMENT_TYPE.SELF.value,
							]),
							tin: Joi.string(),
							companyName: Joi.string(),
							sss: Joi.string(),
							employmentRank: Joi.string().valid([
								LoanConstant.EMPLOYMENT_RANK.ASSISSTANT_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.ASSISTANT_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.CHAIRMAN.value,
								LoanConstant.EMPLOYMENT_RANK.CHIEF_EXECUTIVE_OFFICER.value,
								LoanConstant.EMPLOYMENT_RANK.CLERK.value,
								LoanConstant.EMPLOYMENT_RANK.DIRECTOR.value,
								LoanConstant.EMPLOYMENT_RANK.EXECUTIVE_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.FIRST_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.GENERAL_EMPLOYEE.value,
								LoanConstant.EMPLOYMENT_RANK.MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.NON_PROFESIONNAL.value,
								LoanConstant.EMPLOYMENT_RANK.OWNER.value,
								LoanConstant.EMPLOYMENT_RANK.PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.PROFESSIONAL.value,
								LoanConstant.EMPLOYMENT_RANK.RANK_FILE.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_ASSISTANT_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_ASSISTANT_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_MANAGER.value,
								LoanConstant.EMPLOYMENT_RANK.SENIOR_VICE_PRESIDENT.value,
								LoanConstant.EMPLOYMENT_RANK.SUPERVISOR.value,
								LoanConstant.EMPLOYMENT_RANK.VICE_PRESIDENT.value,
							]),
							employmentTenure: Joi.string().valid(Object.keys(LoanConstant.EMPLOYMENT_TENURE)),
							companyIndustry: Joi.string().valid([
								LoanConstant.INDUSTRIES.AGRI_FOREST_FISH.value,
								LoanConstant.INDUSTRIES.ADVERTISING.value,
								LoanConstant.INDUSTRIES.BUSINESS_INFORMATION.value,
								LoanConstant.INDUSTRIES.CONST_UTIL_CONTRACT.value,
								LoanConstant.INDUSTRIES.EDUCATION.value,
								LoanConstant.INDUSTRIES.ENTERTAINMENT_FASHION.value,
								LoanConstant.INDUSTRIES.FINANCE_INSURANCE.value,
								LoanConstant.INDUSTRIES.FOOD_HOSPITALITY.value,
								LoanConstant.INDUSTRIES.GAMING.value,
								LoanConstant.INDUSTRIES.HEALTH_SERVICES.value,
								LoanConstant.INDUSTRIES.INFORMATION_TECHNOLOGY.value,
								LoanConstant.INDUSTRIES.MANUFACTURING.value,
								LoanConstant.INDUSTRIES.MOTOR_VEHICLE.value,
								LoanConstant.INDUSTRIES.MUSIC_MEDIA.value,
								LoanConstant.INDUSTRIES.NATURAL_RES_ENV.value,
								LoanConstant.INDUSTRIES.OTHER.value,
								LoanConstant.INDUSTRIES.PERSONAL_SERVICES.value,
								LoanConstant.INDUSTRIES.REAL_ESTATE_HOUSING.value,
								LoanConstant.INDUSTRIES.RETAIL.value,
								LoanConstant.INDUSTRIES.SAFETY_SECURITY_LEGAL.value,
								LoanConstant.INDUSTRIES.TRANSPORTATION.value,
							]),
							officePhone: Joi.number(),
							officeEmail: Joi.string().email(),
							officeAddress: Joi.string().max(300),
						},
					}),
					dependentsInfo: Joi.array().items({
						name: Joi.string(),
						age: Joi.number(),
						relationship: Joi.string().valid([
							Constant.DATABASE.RELATIONSHIP.BROTHER,
							Constant.DATABASE.RELATIONSHIP.FATHER,
							Constant.DATABASE.RELATIONSHIP.MOTHER,
							Constant.DATABASE.RELATIONSHIP.SISTER,
							Constant.DATABASE.RELATIONSHIP.SPOUSE,
							Constant.DATABASE.RELATIONSHIP.SON,
							Constant.DATABASE.RELATIONSHIP.DAUGHTER,
						]),
					}),

					tradeReferences: Joi.array().items({
						companyName: Joi.string(),
						type: Joi.string().valid([
							LoanConstant.TRADE_REFERENCE.CUSTOMER,
							LoanConstant.TRADE_REFERENCE.SUPPLIER,
						]),
						contactPerson: Joi.string(),
						contactNumber: Joi.string(),
						position: Joi.string(),
					}),

					// propertyDocuments: Joi.object().keys({
					// 	borrowerValidDocIds: Joi.array().items(Joi.string()),
					// 	coBorrowerValidId: Joi.array().items(Joi.string()),
					// 	latestITR: Joi.string().uri(),
					// 	employmentCert: Joi.string().uri(),
					// 	purchasePropertyInfo: Joi.object().keys({
					// 		address: Joi.string().max(300),
					// 		contactPerson: Joi.string(),
					// 		contactNumber: Joi.number(),
					// 		collateralDocStatus: Joi.boolean(),
					// 		collateralDocList: Joi.array().items({
					// 			docType: Joi.string().valid([
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.RESERVE_AGREEMENT,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_1,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.TAX_DECLARATION_2,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.BILL_MATERIAL,
					// 				Constant.DATABASE.COLLATERAL.DOC.TYPE.FLOOR_PLAN,
					// 			]),
					// 			docUrl: Joi.string(),
					// 		}),
					// 	}),
					// 	nookAgent: Joi.string(),
					// }),
					documents: {
						legalDocument: Joi.array().items(objectSchema),
						incomeDocument: Joi.array().items(objectSchema),
						colleteralDoc: Joi.array().items(objectSchema),
					},
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
	/**
	 * @description admin update loan document status
	 */
	{
		method: 'PATCH',
		path: '/v1/admin/document/{loanId}',
		handler: async (request, h) => {
			try {
				const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
				// const payload = request.payload as AdminRequest.IAddUser;
				const payload: any = {
					...request.params,
					...request.payload as any,
				};

				// const checkPermission = adminData['permission'].some(data => {
				// 	return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
				// });
				// if (checkPermission === false) {
				// 	return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
				// }
				// const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);

				const registerResponse = await LoanController.adminUpdateDocumentStatus(payload);
				return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.UPDATED, {}));
			} catch (error) {
				UniversalFunctions.consolelog('error', error, true);
				return (UniversalFunctions.sendError(error));
			}
		},
		options: {
			description: 'admin update adocument',
			tags: ['api', 'anonymous', 'Admin', 'document', 'status'],
			auth: 'AdminAuth',
			validate: {
				params: {
					loanId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
				},
				payload: {
					documentType: Joi.string().valid([
						LoanConstant.documentType.COLLETERAL,
						LoanConstant.documentType.INCOME,
						LoanConstant.documentType.LEGAL,
					]),
					documentId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/).required(),
					status: Joi.string().valid([
						LoanConstant.DocumentStatus.APPROVED,
						LoanConstant.DocumentStatus.PENDING,
						LoanConstant.DocumentStatus.REJECTED,
					]),
				},
				headers: UniversalFunctions.authorizationHeaderObj,
				failAction: UniversalFunctions.failActionFunction,
			},
			plugins: {
				'hapi-swagger': {
					responseMessages: Constant.swaggerDefaultResponseMessages,
				},
			},
		},
	},
];