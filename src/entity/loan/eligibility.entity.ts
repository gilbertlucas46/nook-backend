import { BaseEntity } from '@src/entity/base/base.entity';
class EligibilityE extends BaseEntity {
    constructor() {
        super('Userloancriteria');
    }
}

export const EligibilityEntity = new EligibilityE();