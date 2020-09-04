
import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret.admin.accessToken');
import * as utils from '@src/utils';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as CONSTANT from '../../constants';
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
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
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
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.REFERRAL_PARTNER,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE[2],
				},
			],
		};

		const criteria = {
			email: 'admin@nook.com.ph',
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

	async adminDashboard(payload, adminData) {
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

			const lastMonthUser = [{
				$facet: {
					last30DaysUser: [{
						$match: {
							createdAt: { $gt: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30), $lt: new Date().getTime() },
						},
					}],
					// graphUser: [
					// 	{
					// 		$match: { createdAt: { $gt: payload.userGraph } },
					// 	},
					// 	{
					// 		$project:
					// 			{ month_joined1: { $month: { $toDate: '$createdAt' } } },
					// 	},
					// 	{ $group: { _id: { month_joined: '$month_joined1' }, number: { $sum: 1 } } },
					// 	{ $sort: { '_id.month_joined1': 1 } },
					// ],
					totalUsers: [{
						$match: {
							$or: [{
								status: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
							},
							{
								status: CONSTANT.DATABASE.STATUS.USER.BLOCKED,
							},
							],
						},
					}],
				},
			}, {
				$project: {
					last30DaysUser: { $size: '$last30DaysUser' },
					totalUsers: { $size: '$totalUsers' },
				},
			}];

			const preQualification = {
				status: 'Active',
				createdAt: { $gt: payload.preQualificationGraph },
			};

			const LoanList = [
				{
					$match: {
						status: CONSTANT.DATABASE.STATUS.LOAN_STATUS.ACTIVE
					},
				},
				{
					$facet: {
						// TOTAL_LOAN_APPLICATION: [{
						// 	$group: { _id: null, myCount: { $sum: 1 } },
						// },
						// {
						// 	$project: { _id: 0 },
						// },

						// ],
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

			const graphLoanApplication = [
				{
					$match: {
						status: CONSTANT.DATABASE.STATUS.LOAN_STATUS.ACTIVE,
						createdAt: { $gt: payload.loanGraph },
					},
				},
				{
					$project:
						{ month_joined: { $month: { $toDate: '$createdAt' } } },
				},
				{ $group: { _id: { month_joined: '$month_joined' }, number: { $sum: 1 } } },
				{ $sort: { '_id.month_joined': 1 } },
			];

			const graphPreQualification = [
				{
					$match: { createdAt: { $gt: payload.preQualificationGraph } },
				},
				{
					$project:
						{ month_joined1: { $month: { $toDate: '$createdAt' } } },
				},
				{ $group: { _id: { month_joined: '$month_joined1' }, number: { $sum: 1 } } },
				{ $sort: { '_id.month_joined1': 1 } },
			];
			const userGraphQuery = [
				{
					$match: { createdAt: { $gt: payload.userGraph } },
				},
				{
					$project:
						{ month_joined1: { $month: { $toDate: '$createdAt' } } },
				},
				{ $group: { _id: { month_joined: '$month_joined1' }, userCount: { $sum: 1 } } },
				{ $sort: { '_id.month_joined1': 1 } },
			];

			pipeline.push(this.DAOManager.aggregateData('User', lastMonthUser));
			pipeline.push(this.DAOManager.aggregateData('LoanApplication', LoanList));
			pipeline.push(this.DAOManager.count('Admin', totalNookStaff));
			pipeline.push(this.DAOManager.count('Article', totalArticles));
			pipeline.push(this.DAOManager.count('LoanReferral', {}));
			pipeline.push(this.DAOManager.count('PreQualification', preQualification));


			pipeline.push(this.DAOManager.aggregateData('LoanApplication', graphLoanApplication));
			pipeline.push(this.DAOManager.aggregateData('PreQualification', graphPreQualification));
			pipeline.push(this.DAOManager.count('LoanApplication', { status: CONSTANT.DATABASE.STATUS.LOAN_STATUS.ACTIVE, createdAt: { $gt: payload.loanGraph } }));
			pipeline.push(this.DAOManager.aggregateData('User', userGraphQuery));
			const [userCount, loanCount, staffcount, articleCount, referralCount, preQualificationCount, loanGraph, preQualificationGraph, totalLoanApplication, userGraphData] = await Promise.all(pipeline);

			// const loanGraph1 = {};
			// const preQualificationGraph1 = {};
			// const userGraph = {};
			const loanGraph1 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
			const preQualificationGraph1 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
			const userGraph = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };

			// Obj[key]=value
			loanGraph.map(data => {
				loanGraph1[data['_id']['month_joined']] = data.number;

			});
			preQualificationGraph.map(data => {
				preQualificationGraph1[data['_id']['month_joined']] = data.number;
			});
			userGraphData.map(data => {
				userGraph[data['_id']['month_joined']] = data.userCount;
			});
			function clean(obj) {
				for (const propName in userGraph) {
					if (userGraph[propName] === null || userGraph[propName] === undefined || userGraph[propName] === 0) {
						delete userGraph[propName];
					}
				}
			}

			clean(userGraph);

			return {
				userCount: userCount[0],
				loanCount: loanCount[0],
				staffcount,
				articleCount,
				referralCount,
				preQualificationCount,
				loanGraph1,
				preQualificationGraph1,
				totalLoanApplication,
				userGraph,
				// userGraphData,

			};

		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const AdminE = new AdminClass();
