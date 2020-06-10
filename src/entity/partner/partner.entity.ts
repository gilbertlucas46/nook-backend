import { BaseEntity } from '@src/entity/base/base.entity';


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
}
export const PartnerE = new PartnerClass();
