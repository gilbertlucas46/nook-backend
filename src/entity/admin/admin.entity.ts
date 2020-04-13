
import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret.admin.accessToken');
import * as utils from '@src/utils';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as CONSTANT from '../../constants';
import { promises } from 'fs';
const pswdCert: string = config.get('jwtSecret.admin.forgotToken');

/**
 * @author
 * @description This controller contains actions by admin .
 */
export class AdminClass extends BaseEntity {
	constructor() {
		super('Admin');
	}

	async createAdmin(adminData: AdminRequest.AdminData) {
		try {
			const dataToInsert = {
				email: adminData.email,
				// password:userData.password ,
				firstName: adminData.firstName,
				lastName: adminData.lastName,
				phoneNumber: adminData.phoneNumber,
				type: CONSTANT.DATABASE.USER_TYPE.ADMIN.TYPE,
			};
			return await this.createOneEntity(dataToInsert);

		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 *
	 * @param adminData
	 * @description:default admin creator
	 */
	async adminAccountCreator() {
		const toSave = {
			name: 'Nook Admin',
			email: 'admin@nook.com.ph',
			firstName: 'Nook',
			lastName: 'Admin',
			password: await utils.encryptWordpressHashNode('admin@nook'),
			profilePicUrl: '',
			permission: [
				// {
				// 	moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
				// 	accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				// },
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.Article_Category,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.loanReferrals,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
			],
		};

		const criteria = {
			email: 'base_admin@yopmail.com',
		};
		const theData = await this.getOneEntity(criteria, {});
		if (!theData) { await this.createOneEntity(toSave); }
		return '__ADMIN ACCOUNT LOOKUP/CREATION DONE__';
	}

	async createToken(adminData: AdminRequest.TokenPayload) {
		try {
			return Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), _id: adminData.adminId, type: adminData.type }, cert);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createPasswordResetToken(adminData) {
		try {
			const tokenToSend = Jwt.sign(adminData.email, pswdCert, { algorithm: 'HS256' });
			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
			const criteriaForUpdatePswd = { _id: adminData._id };
			const dataToUpdateForPswd = {
				passwordResetToken: tokenToSend,
				passwordResetTokenExpirationTime: expirationTime,
			};
			await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
			return tokenToSend;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getData(criteria, ProjectData) {
		try {
			return await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @description admin dashoard
	 * @param adminData 
	 */

	async adminDashboard(adminData) {
		try {

			const totalArticles = {
				status: {
					$eq: CONSTANT.DATABASE.ARTICLE_STATUS.ACTIVE,
				},
			};
			// };

			const totalNookStaff = {
				type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
				$or: [{
					staffStatus: CONSTANT.DATABASE.STATUS.ADMIN.ACTIVE,
				}, {
					staffStatus: CONSTANT.DATABASE.STATUS.ADMIN.BLOCKED,
				},
				],
			};
			const pipeline = [];

			const UsersList = {
				$or: [{
					status: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
				},
				{
					status: CONSTANT.DATABASE.STATUS.USER.BLOCKED,
				},
				],
			};

			const preQualification = {
				status: 'Active',
			};

			const LoanList = [{
				$facet: {
					NEW: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NEW.value,
						},
					}],
					REFERRED_TO_BANK: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.REFERRED.value,
						},
					}],
					BANK_APPROVED: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.BANK_APPROVED.value,
						},
					}],
					BANK_DECLINED: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.BANK_DECLINED.value,
						},
					}],
					NOOK_DECLINED: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NOOK_DECLINED.value,

						},
					}],
					NOOK_REVIEW: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.NOOK_REVIEW.value,

						},
					}],
					DRAFT: [{
						$match: {
							applicationStatus: CONSTANT.DATABASE.LOAN_APPLICATION_STATUS.DRAFT.value,
						},
					}],
				},
			},
			{
				$project: {
					NEW: { $size: '$NEW' },
					REFERRED_TO_BANK: { $size: '$REFERRED_TO_BANK' },
					BANK_APPROVED: { $size: '$BANK_APPROVED' },
					BANK_DECLINED: { $size: '$BANK_DECLINED' },
					NOOK_DECLINED: { $size: '$NOOK_DECLINED' },
					NOOK_REVIEW: { $size: '$NOOK_REVIEW' },
					DRAFT: { $size: '$DRAFT' },
				},
			}];
			pipeline.push(this.DAOManager.count('User', UsersList));
			pipeline.push(this.DAOManager.aggregateData('LoanApplication', LoanList));
			pipeline.push(this.DAOManager.count('Admin', totalNookStaff));
			pipeline.push(this.DAOManager.count('Article', totalArticles));
			pipeline.push(this.DAOManager.count('LoanReferral', {}));
			pipeline.push(this.DAOManager.count('PreQualification', preQualification));

			const [userCount, loanCount, staffcount, articleCount, referralCount, preQualificationCount] = await Promise.all(pipeline);
			return {
				userCount,
				loanCount: loanCount[0],
				staffcount,
				articleCount,
				referralCount,
				preQualificationCount,
				// enquiryCount,
			};

		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const AdminE = new AdminClass();
