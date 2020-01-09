import { BaseEntity } from '@src/entity/base/base.entity';
import { RegionDocument, IRegion } from '@src/models/region';
import { REGIONS } from '@src/constants/region.constants';
import { ICity } from '@src/models/city';
// import { cityEntity } from './cities.entity';

class BankEntity extends BaseEntity {
    constructor() {
        super('Bank');
    }

}

export const BankE = new BankEntity();
