import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as TokenManager from '@src/lib';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';

export class UserClass extends BaseEntity {
	constructor() {
		super('User');
	}
	async createUser(userData: UserRequest.UserData) {
		try {
			const dataToInsert = {
				name: userData.userName,
				email: userData.email,
				// password:userData.password ,
				firstName: userData.firstName,
				lastName: userData.lastName,
				phoneNumber: userData.phoneNumber,
			};
			const user: UserRequest.Register = await this.createOneEntity(dataToInsert);
			return user;
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createToken(payload, userData: UserRequest.UserData) {
		try {
			let sessionValid = {};
			if (userData.session) {
				sessionValid = {
					session: userData.session,
				};
			}
			let tokenData;
			// if (!userData.type) {
			//     tokenData = {
			//         id: userData._id,
			//         deviceId: payload.deviceId,
			//         deviceToken: payload.deviceToken,
			//         tokenType: "TENANT",
			//         timestamp: new Date().getTime(),
			//         session: userData.session
			//     }
			// } else {
			tokenData = {
				id: userData._id,
				tokenType: userData.type,
				timestamp: new Date().getTime(),
				session: userData.session,
			};
			// }

			const mergeData = { ...tokenData, ...sessionValid };
			const accessToken: any = await TokenManager.setToken(mergeData);
			return accessToken.accessToken;

		} catch (error) {
			return Promise.reject(error);
		}
	}
	async createPasswordResetToken(userData) {
		try {
			const tokenToSend = Jwt.sign(userData.email, cert, { algorithm: 'HS256' });
			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);

			const criteriaForUpdatePswd = { _id: userData._id };
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

	async userDashboad(userData: UserRequest.UserData) {
		try {
			const pipeline = [
				{
					$facet: {
						Active: [
							{
								$match: {
									$and: [
										{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
										{ userId: userData._id }],
								},
							},
							{ $count: 'Total' },
						],
						Featured: [
							{
								$match: {
									$and: [
										{ isFeatured: true },
										{ userId: userData._id },
									],
								},
							},
							{ $count: 'Total' },
						],
						soldPropertyLast30Days: [
							{
								$match: {
									$and: [
										{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
										{ 'property_basic_details.property_for_number': Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER },
										{ userId: userData._id },
										{ sold_rent_time: { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
									],
								},
							},
							{ $count: 'Total' },
						],
						rentedPropertyLast30Days: [
							{
								$match: {
									$and: [
										{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
										{ 'property_basic_details.property_for_number': Constant.DATABASE.PROPERTY_FOR.RENT.NUMBER },
										{ userId: userData._id },
										{ sold_rent_time: { $gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
									],
								},
							},
							{ $count: 'Total' },
						],
					},
				},
				{
					$project: {
						Active: {
							$cond: { if: { $size: '$Active' }, then: { $arrayElemAt: ['$Active.Total', 0] }, else: 0 },
						},
						Featured: {
							$cond: { if: { $size: ['$Featured'] }, then: { $arrayElemAt: ['$Featured.Total', 0] }, else: 0 },
						},
						soldPropertyLast30Days: {
							$cond: { if: { $size: ['$soldPropertyLast30Days'] }, then: { $arrayElemAt: ['$soldPropertyLast30Days.Total', 0] }, else: 0 },
						},
						rentedPropertyLast30Days: {
							$cond: { if: { $size: ['$rentedPropertyLast30Days'] }, then: { $arrayElemAt: ['$rentedPropertyLast30Days.Total', 0] }, else: 0 },
						},
					},
				},
			];
			const query = {
				$and: [
					{ propertyOwnerId: userData._id },
					{ createdAt: { $gt: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
				],
			};
			const enquiryLast30Days = await this.DAOManager.count('Enquiry', query);
			const data = await this.DAOManager.aggregateData('Property', pipeline);
			return {
				...data[0],
				isFeaturedProfile: !!userData.isFeaturedProfile,
				enquiryLast30Day: enquiryLast30Days,
			};

		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const UserE = new UserClass();
