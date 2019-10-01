// import { BaseEntity } from '../base.entity';
// import * as config from 'config';
// import * as Jwt from 'jsonwebtoken';
// const cert: any = config.get('jwtSecret');
// import * as utils from '@src/utils';
// import { UserRequest } from '@src/interfaces/user.interface';
// import { AdminRequest } from '@src/interfaces/admin.interface';
// import * as CONSTANT from '../../constants';
// export class AdminClass extends BaseEntity {
// 	constructor() {
// 		super('Admin');
// 	}

// 	async createAdmin(adminData: AdminRequest.AdminData) {
// 		try {
// 			const dataToInsert = {
// 				email: adminData.email,
// 				// password:adminData.password ,
// 				firstName: adminData.firstName,
// 				lastName: adminData.lastName,
// 				phoneNumber: adminData.phoneNumber,
// 				// type: CONSTANT.DATABASE.USER_TYPE.ADMIN.TYPE,

// 			};
// 			const admin: UserRequest.Register = await this.createOneEntity(dataToInsert);
// 			return admin;
// 		} catch (error) {
// 			return Promise.reject(error);
// 		}
// 	}

// 	async adminAccountCreator() {
// 		const toSave = {
// 			name: 'Base Admin',
// 			email: 'base_admin@yopmail.com',
// 			password: await utils.cryptData('123456'),
// 			profilePicUrl: '',
// 			// type: CONSTANT.DATABASE.USER_TYPE.ADMIN.TYPE,

// 		};
// 		const criteria = {
// 			email: 'base_admin@yopmail.com',
// 		};
// 		const theData = await this.getOneEntity(criteria, {});
// 		if (!theData) { await this.createOneEntity(toSave); }
// 		return '__ADMIN ACCOUNT LOOKUP/CREATION DONE__';
// 	}

// 	async createToken(adminData: AdminRequest.TokenPayload) {
// 		try {
// 			const accessToken = Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), id: adminData.adminId }, cert);
// 			// const accessToken = Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), id: adminData.adminId, tokenType: adminData.type }, cert);

// 			return accessToken;
// 		} catch (error) {
// 			return Promise.reject(error);
// 		}
// 	}

// 	async createPasswordResetToken(adminData) {
// 		try {
// 			const tokenToSend = Jwt.sign(adminData.email, cert, { algorithm: 'HS256' });
// 			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);
// 			const criteriaForUpdatePswd = { _id: adminData._id };

// 			const dataToUpdateForPswd = {
// 				passwordResetToken: tokenToSend,
// 				passwordResetTokenExpirationTime: expirationTime,
// 			};
// 			await this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
// 			return tokenToSend;
// 		} catch (error) {
// 			return Promise.reject(error);
// 		}
// 	}

// 	async getData(criteria, ProjectData) {
// 		try {
// 			const data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
// 			return data;
// 		} catch (error) {
// 			Promise.reject(error);
// 		}
// 	}
// }

// export const AdminE = new AdminClass();

import { BaseEntity } from '../base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as CONSTANT from '../../constants';

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
			const admin: UserRequest.Register = await this.createOneEntity(dataToInsert);
			return admin;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async adminAccountCreator() {
		const toSave = {
			name: 'Base Admin',
			email: 'base_admin@yopmail.com',
			password: await utils.cryptData('123456'),
			profilePicUrl: '',
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
			const accessToken = Jwt.sign({ sessionId: adminData.sessionId, timestamp: Date.now(), _id: adminData.adminId, type: adminData.type }, cert);
			return accessToken;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createPasswordResetToken(adminData) {
		try {
			const tokenToSend = Jwt.sign(adminData.email, cert, { algorithm: 'HS256' });
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
			const data = await this.DAOManager.findOne(this.modelName, criteria, ProjectData);
			return data;
		} catch (error) {
			Promise.reject(error);
		}
	}
	async adminDashboard(adminData) {
		try {
			const pipeline = [
				{
					$facet: {
						adminTotalProperty: [
							{
								$match: {
									'property_status.number': { $ne: CONSTANT.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER },
								},
							},
							{ $count: 'Total' },
						],
						adminActiveProperty: [
							{
								$match: {
									'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
								},
							},
							{ $count: 'Total' },
						],
						adminDeclineProperty: [
							{
								$match: {
									'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
								},
							},
							{ $count: 'Total' },
						],
						adminPendingProperty: [
							{
								$match: {
									'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
								},
							},
							{ $count: 'Total' },
						],
					},
				},
				{
					$project: {
						totalProperty: {
							$cond: { if: { $size: ['$adminTotalProperty'] }, then: { $arrayElemAt: ['$adminTotalProperty.Total', 0] }, else: 0 },
						},
						activeProperty: {
							$cond: { if: { $size: ['$adminActiveProperty'] }, then: { $arrayElemAt: ['$adminActiveProperty.Total', 0] }, else: 0 },
						},
						declineProperty: {
							$cond: { if: { $size: ['$adminDeclineProperty'] }, then: { $arrayElemAt: ['$adminDeclineProperty.Total', 0] }, else: 0 },
						},
						pendingProperty: {
							$cond: { if: { $size: ['$adminPendingProperty'] }, then: { $arrayElemAt: ['$adminPendingProperty.Total', 0] }, else: 0 },
						},
					},
				},
			];
			const query = {
				$and: [
					{ propertyOwnerId: adminData._id },
					{ createdAt: { $gt: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
				],
			};

			const data = await this.DAOManager.aggregateData('Property', pipeline);
			return {
				...data[0],
			};

		} catch (error) {
			return Promise.reject(error);
		}
	}

}

export const AdminE = new AdminClass();
