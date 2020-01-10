import { BaseEntity } from '@src/entity/base/base.entity';
import { RegionDocument, IRegion } from '@src/models/region';
import { REGIONS } from '@src/constants/region.constants';
import { ICity } from '@src/models/city';
// import { cityEntity } from './cities.entity';

class UserLoanCriteriaEntity extends BaseEntity {
    constructor() {
        super('Userloancriteria');
    }

}

export const loanCriteriaE = new UserLoanCriteriaEntity();
