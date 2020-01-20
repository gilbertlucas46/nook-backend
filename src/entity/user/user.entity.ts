import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as TokenManager from '@src/lib';
import * as Jwt from 'jsonwebtoken';
const pswdCert: string = config.get('jwtSecret.app.forgotToken');
import { UserRequest } from '@src/interfaces/user.interface';
import * as Constant from '@src/constants';
import { Types } from 'mongoose';

export class UserClass extends BaseEntity {
	constructor() {
		super('User');
	}
	/**
	 * @function createToken
	 * @description function to create accessToken
	 * @payload  ProfileUpdate
	 * return object
	 */
	async createToken(payload, userData: UserRequest.UserData) {
		try {
			let sessionValid = {};
			if (userData.session) {
				sessionValid = {
					session: userData.session,
				};
			}
			const tokenData = {
				id: userData._id,
				tokenType: userData.type,
				timestamp: new Date().getTime(),
				session: userData.session,
			};

			const mergeData = { ...tokenData, ...sessionValid };
			const accessToken = await TokenManager.setToken(mergeData);
			return accessToken.accessToken;

		} catch (error) {
			return Promise.reject(error);
		}
	}

	async createPasswordResetToken(userData) {
		try {
			const tokenToSend = Jwt.sign(userData.email, pswdCert, { algorithm: 'HS256' });
			const expirationTime = new Date(new Date().getTime() + 10 * 60 * 1000);

			const criteriaForUpdatePswd = { _id: userData._id };
			const dataToUpdateForPswd = {
				passwordResetToken: tokenToSend,
				passwordResetTokenExpirationTime: expirationTime,
			};
			this.updateOneEntity(criteriaForUpdatePswd, dataToUpdateForPswd);
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
			const promise = [];
			if (userData.type === Constant.DATABASE.USER_TYPE.TENANT.TYPE) {
				const query = {
					$and: [
						{ userId: userData._id },
						// { createdAt: { $gt: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
					],
				};
				const savedQuery = {
					userId: userData._id,
				};
				promise.push(this.DAOManager.count('Enquiry', query));
				promise.push(this.DAOManager.count('SavedProperty', savedQuery));
				const [totalEnquiry, totalSavedProperty] = await Promise.all(promise);

				return {
					totalEnquiry,
					totalSavedProperty,
				};

			} else {
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
									$lookup: {
										from: 'subscriptions',
										let: { propertyId: '$_id' },
										pipeline: [
											{
												$match: {
													$expr: {
														$and: [{ $eq: ['$propertyId', '$$propertyId'] },
														{ $eq: ['$featuredType', Constant.DATABASE.FEATURED_TYPE.PROPERTY] },
														{ $eq: ['$userId', userData._id] },
														{ $eq: ['status', Constant.DATABASE.SUBSCRIPTION_STATUS.ACTIVE] },
														],
													},
												},
											},
											// { $match: { $and: [{ startDate: { $lte: new Date().getTime() } }, { endDate: { $gte: new Date().getTime() } }] } },
											{ $project: { _id: 1 } },
										],
										as: 'subscriptions',
									},
								},
								{ $project: { subscriptions: { $size: '$subscriptions' } } },
								{ $match: { subscriptions: { $gt: 0 } } },
							],
							soldPropertyLast30Days: [
								{
									$match: {
										$and: [
											{ 'property_status.number': Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
											{ 'property_basic_details.property_for_number': Constant.DATABASE.PROPERTY_FOR.SALE.NUMBER },
											{ userId: userData._id },
											{
												sold_rent_time: {
													$gte: new Date().getTime() - (30 * 24 * 60 * 60 * 1000)
												}
											},
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
							Featured: { $size: '$Featured.subscriptions' },
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
					// isFeaturedProfile: !!userData.isFeaturedProfile,
					enquiryLast30Day: enquiryLast30Days,
				};
			}

		} catch (error) {
			return Promise.reject(error);
		}
	}
	/**
	 * @description A Function to create token for after register api
	 */
	createRegisterToken(id: string | Types.ObjectId): string {
		return TokenManager.generateToken({ id });
	}
	/**
	 * @description A function to update the user with register second step data
	 * @param token A token to validate correct user request
	 * @param data A Data to update
	 */
	async completeRegisterProcess(token: string, data: object) {
		try {
			const { id } = await TokenManager.decodeToken(token) as { id: string };
			await this.DAOManager.findAndUpdate(this.modelName, {
				_id: new Types.ObjectId(id),
			}, data);
			return;
		} catch (err) {
			console.log(err);
			// @TODO handle error messages for token and update failed
			return Promise.reject(err);
		}
	}
}

export const UserE = new UserClass();
