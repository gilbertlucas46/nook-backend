
import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import * as utils from '@src/utils';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as CONSTANT from '../../constants';
const pswdCert: string = config.get('forgetPwdjwtSecret');

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
			name: 'Base Admin',
			email: 'base_admin@yopmail.com',
			password: await utils.encryptWordpressHashNode('123456'),
			profilePicUrl: '',
			permission: [
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.DASHBOARD,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.PROPERTIES,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.ARTICLE,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.HELP_CENTER,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.STAFF,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{

					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.LOAN,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.Article_Category,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.USERS,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.loanReferrals,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,
				},
				{
					moduleName: CONSTANT.DATABASE.PERMISSION.TYPE.Subscriptions,
					accessLevel: CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE,

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
			Promise.reject(error);
		}
	}
	/**
	 *
	 * @param adminData
	 * @description : admin dashboard
	 */
	// async adminDashboard(adminData) {
	// 	try {
	// const pipeline = [
	// {
	// 	$facet: {
	// 		adminTotalProperty: [
	// 			{
	// 				$match: {
	// 					'property_status.number': { $ne: CONSTANT.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER },
	// 				},
	// 			},
	// 			{ $count: 'Total' },
	// 		],
	// 		totalUser: [
	// 			{
	// 				$match: {
	// 					status: {
	// 						$or: [
	// 							CONSTANT.DATABASE.STATUS.USER.ACTIVE,
	// 							CONSTANT.DATABASE.STATUS.USER.BLOCKED,
	// 						],
	// 					},
	// 				},
	// 			},
	// 			{ $count: 'Total' },
	// 		],

	// adminActiveProperty: [
	// 	{
	// 		$match: {
	// 			'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER,
	// 		},
	// 	},
	// 	{ $count: 'Total' },
	// ],

	// adminDeclineProperty: [
	// 	{
	// 		$match: {
	// 			'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER,
	// 		},
	// 	},
	// 	{ $count: 'Total' },
	// ],

	// adminPendingProperty: [
	// 	{
	// 		$match: {
	// 			'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.PENDING.NUMBER,
	// 		},
	// 	},
	// 	{ $count: 'Total' },
	// ],
	// },
	// },
	// {
	// 	$project: {
	// 		totalProperty: {
	// 			$cond: { if: { $size: ['$adminTotalProperty'] }, then: { $arrayElemAt: ['$adminTotalProperty.Total', 0] }, else: 0 },
	// 		},
	// activeProperty: {
	// 	$cond: { if: { $size: ['$adminActiveProperty'] }, then: { $arrayElemAt: ['$adminActiveProperty.Total', 0] }, else: 0 },
	// },

	// declineProperty: {
	// 	$cond: { if: { $size: ['$adminDeclineProperty'] }, then: { $arrayElemAt: ['$adminDeclineProperty.Total', 0] }, else: 0 },
	// },

	// pendingProperty: {
	// 	$cond: { if: { $size: ['$adminPendingProperty'] }, then: { $arrayElemAt: ['$adminPendingProperty.Total', 0] }, else: 0 },
	// },
	// 		},
	// 	},
	// ];
	// 		const query = {
	// 			$and: [
	// 				{ propertyOwnerId: adminData._id },
	// 				{ createdAt: { $gt: new Date().getTime() - (30 * 24 * 60 * 60 * 1000) } },
	// 			],
	// 		};

	// 		const data = await this.DAOManager.aggregateData('Property', pipeline);
	// 		return {
	// 			...data[0],
	// 		};

	// 	} catch (error) {
	// 		return Promise.reject(error);
	// 	}
	// }
	async adminDashboard(adminData) {
		try {
			const propertyQuery = {
				'property_status.number': { $ne: CONSTANT.DATABASE.PROPERTY_STATUS.DRAFT.NUMBER },
			};

			const totalUser = {
				$or: [{
					status: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
				}, {
					status: CONSTANT.DATABASE.STATUS.USER.BLOCKED,
				},
				],
			};
			const totalArticles = {
				status: {
					$eq: CONSTANT.DATABASE.ARTICLE_STATUS.ACTIVE,
				},
			};
			const loanQuery = {
				saveAsDraft: {
					$ne: true,
				},
			};

			const propertPromise = new Promise((resolve) => {
				resolve(this.DAOManager.count('Property', propertyQuery));
			});
			const userPromise = new Promise((resolve) => {
				resolve(this.DAOManager.count('User', totalUser));
			});
			const articlePromise = new Promise((resolve) => {
				resolve(this.DAOManager.count('Article', totalArticles));
			});
			const enquiryPromise = new Promise((resolve) => {
				resolve(this.DAOManager.count('Enquiry', {}));
			});
			const loanPromsie = new Promise((resolve) => {
				resolve(this.DAOManager.count('LoanApplication', loanQuery));
			});
			return Promise.all([propertPromise, userPromise, articlePromise, enquiryPromise, loanPromsie])
				.then(([propertyCount, userCount, articleCount, enquiryCount, loanCount]) => {
					return { propertyCount, userCount, articleCount, enquiryCount, loanCount };
				});
		} catch (error) {
			return Promise.reject(error);
		}
	}

	async getPropertyList(payload: AdminRequest.AdminPropertyList) {
		try {
			const pipeline = [];
			let { page, limit, sortBy, sortType } = payload;
			const { searchTerm, property_status, fromDate, toDate, byCity, byRegion, propertyType } = payload;
			if (!limit) { limit = CONSTANT.SERVER.LIMIT; }
			if (!page) { page = 1; }
			let sortingType = {};
			sortType = !sortType ? -1 : sortType;
			let matchObject: any = {};
			const skip = (limit * (page - 1));
			if (property_status === CONSTANT.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {  // for active
				sortingType = {
					updatedAt: sortType,
				};
			} else {
				sortingType = {
					createdAt: sortType,
				};
			}

			if (sortBy) {
				switch (sortBy) {
					case 'price':
						sortBy = 'price';
						sortingType = {
							'property_basic_details.sale_rent_price': sortType,
						};
						break;
					case 'isFeatured':
						sortBy = 'isFeatured';
						sortingType = {
							isFeatured: sortType,
						};
						break;
					default:
						sortBy = 'createdAt';
						sortingType = {
							updatedAt: sortType,
						};
						break;
				}
			}
			function hasWhiteSpace(s) {
				return s.indexOf(' ') >= 0;
			}
			let firstname;
			let lastname;
			if (searchTerm) {
				const check = hasWhiteSpace(searchTerm);
				if (check) {
					firstname = searchTerm.split[' '][0];
					lastname = searchTerm.split[' '][1];
				} else {
					firstname = searchTerm;
					lastname = searchTerm;
				}
				matchObject = {
					$or: [
						{ 'property_address.address': new RegExp('.*' + searchTerm + '.*', 'i') },
						{ 'property_address.cityName': new RegExp('.*' + searchTerm + '.*', 'i') },
						{ 'property_added_by.email': new RegExp('.*' + searchTerm + '.*', 'i') },
						{ 'property_basic_details.title': new RegExp('.*' + searchTerm + '.*', 'i') },
						{ propertyId: new RegExp('.*' + searchTerm + '.*', 'i') },
						{ 'property_added_by.firstName': new RegExp('.*' + firstname + '.*', 'i') },
						{ 'property_added_by.lastName': new RegExp('.*' + lastname + '.*', 'i') },
					],
				};
			}

			// List of all properties for admin.
			if (!property_status) {
				matchObject = {
					$or: [
						{ 'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.PENDING.NUMBER },
						{ 'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
						{ 'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER },
						{ 'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER },
						{ 'property_status.number': CONSTANT.DATABASE.PROPERTY_STATUS.EXPIRED.NUMBER },
					],
				};
			}

			if (property_status) {
				matchObject['property_status.number'] = payload.property_status;
			}
			if (propertyType) matchObject['property_basic_details.type'] = payload.propertyType;
			if (byCity) { matchObject['cityId'] = byCity; }
			if (byRegion) { matchObject['regionId'] = byRegion; }

			// Date filters
			if (fromDate && toDate) { matchObject['createdAt'] = { $gte: fromDate, $lte: toDate }; }
			if (fromDate && !toDate) { matchObject['createdAt'] = { $gte: fromDate }; }
			if (!fromDate && toDate) { matchObject['createdAt'] = { $lte: toDate }; }

			pipeline.push(this.DAOManager.findAll('Property', matchObject, { propertyActions: 0 }, { limit, skip, sort: sortingType }));
			pipeline.push(this.DAOManager.count('Property', matchObject));
			const [data, total] = await Promise.all(pipeline);
			return {
				data,
				total,
			};
		} catch (error) {
			return Promise.reject(error);
		}
	}
}

export const AdminE = new AdminClass();
