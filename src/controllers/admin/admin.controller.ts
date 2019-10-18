import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { Types } from 'mongoose';
import { PropertyRequest } from '@src/interfaces/property.interface';

/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminController {

	getTypeAndDisplayName(findObj, num) {
		const obj = findObj;
		const data = Object.values(obj);
		const result = data.filter((x: any) => {
			return x.NUMBER === num;
		});
		return result[0];
	}
	/**
	 *
	 * @param payload
	 */
	async getProperty(payload: PropertyRequest.SearchProperty) {
		try {
			// if (!payload.property_status) payload.property_status = Constant.DATABASE.PROPERTY_STATUS.ADMIN_PROPERTIES_LIST.NUMBER;
			const getPropertyData = await ENTITY.AdminE.getPropertyList(payload);
			if (!getPropertyData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID); }
			return getPropertyData;
		} catch (error) {
			utils.consolelog(error, 'error', true);
			return Promise.reject(error);
		}
	}
	/**
	 *
	 * @param payload property detail by _id
	 */

	async getPropertyById(payload: AdminRequest.PropertyDetail) {
		try {
			const getPropertyData = await ENTITY.PropertyE.getPropertyDetailsById(payload.propertyId);
			if (!getPropertyData) { return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID); }
			return getPropertyData;
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async updatePropertyStatus(payload: AdminRequest.UpdatePropertyStatus, adminData) {
		try {
			const criteria = { _id: Types.ObjectId(payload.propertyId) };
			let result: any;
			const dataToSet: any = {};

			if (payload.status === Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER);
			} else if (payload.status === Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
				result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER);
			} else {
				return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_PROPERTY_STATUS);
			}

			dataToSet.$set = {
				property_status: {
					number: result.NUMBER,
					status: result.TYPE,
					displayName: result.DISPLAY_NAME,
				},
				approvedAt: new Date().getTime(),
			};

			dataToSet.$push = {
				propertyActions: {
					actionNumber: result.NUMBER,
					actionString: result.TYPE,
					actionPerformedBy: {
						userId: adminData._id,
						userType: adminData.TYPE,
					},
					actionTime: new Date().getTime(),
				},
			};
			const updateStatus = await ENTITY.PropertyE.updateOneEntity(criteria, dataToSet);
			return updateStatus;

		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}

	async dashboard(adminData) {
		try {
			return await ENTITY.AdminE.adminDashboard(adminData);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}

export let AdminService = new AdminController();
