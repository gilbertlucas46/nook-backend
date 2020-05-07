import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';

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
	 * @function dashboard
	 * @description admin dashboard data
	 * @payload  adminData:adminData
	 * return {}
	 */
	async dashboard(payload, adminData) {
		try {
			return await ENTITY.AdminE.adminDashboard(payload, adminData);
		} catch (error) {
			utils.consolelog('error', error, true);
			return Promise.reject(error);
		}
	}
}
export let AdminService = new AdminController();