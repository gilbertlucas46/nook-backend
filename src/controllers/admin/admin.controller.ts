import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from '../../utils/index';
import { AdminRequest } from '@src/interfaces/admin.interface';
import { Types } from 'mongoose';
import { sendSuccess } from '../../utils';
// import { stripeService } from '../../lib/stripe.manager';
import { illegal } from 'boom';
import { strip } from 'joi';
import * as config from 'config';
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