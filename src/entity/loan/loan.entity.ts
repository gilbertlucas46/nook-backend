import { BaseEntity } from '@src/entity/base/base.entity';

 class LoanEntities extends BaseEntity {
    constructor() {
        super('Bank');
    }
}

export const LoanEntity = new LoanEntities();
