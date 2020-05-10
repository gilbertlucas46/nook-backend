import { BaseEntity } from '@src/entity/base/base.entity';
class EligibilityE extends BaseEntity {
    constructor() {
        super('LoanErrorCheck');
    }
}

export const LoanErrorE = new EligibilityE();