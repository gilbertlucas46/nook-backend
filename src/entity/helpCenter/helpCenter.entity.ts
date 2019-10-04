import { BaseEntity } from '@src/entity/base/base.entity';

export class HelpCenterEntity extends BaseEntity {
    constructor() {
        super('HelpCenter');
    }

}

export let HelpCenterE = new HelpCenterEntity();