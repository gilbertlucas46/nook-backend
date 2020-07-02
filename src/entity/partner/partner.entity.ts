import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants/app.constant';
import { PartnerAdminRequest } from '@src/interfaces/partner.interface';
export class PartnerClass extends BaseEntity {
	constructor() {
		super('Partner');
	}
	/**
	 * @function adminCreatePartner
	 * @description function to create partner by admin
	 * @payload  
	 * return object
	 */

	async getPartners(payload: PartnerAdminRequest.GetPartners) {
		try {
			const { page, limit } = payload;

			const paginateOptions = {
				page: page || 1,
				limit: limit || 10,
			};
			const matchPipeline = [{
				$match: {
					$or: [{
						status: Constant.DATABASE.PartnerStatus.ACTIVE,
					}, {
						status: Constant.DATABASE.PartnerStatus.BLOCK,
					}],
				},
			}];
			const data = await this.DAOManager.paginatePipeline(matchPipeline, paginateOptions, []).aggregate(this.modelName);
			return data;
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
export const PartnerE = new PartnerClass();
