import { BaseEntity } from '@src/entity/base/base.entity';

export class HelpCenterCategoryEntity extends BaseEntity {
    constructor() {
        super('HelpCentreCategory');
    }


}

export let HelpCenterCatgoryE = new HelpCenterCategoryEntity();