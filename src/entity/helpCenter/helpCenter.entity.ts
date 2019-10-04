import { BaseEntity } from '@src/entity/base/base.entity';

export class HelpCenterEntity extends BaseEntity {
    constructor() {
        super('HelpCentre');
    }

}

export let HelpCenterE = new HelpCenterEntity();