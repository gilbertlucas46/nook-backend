
import { BaseEntity } from '@src/entity/base/base.entity';

export class CardClass extends BaseEntity {
    constructor() {
        super('Card');
    }
}
export const UserCardE = new CardClass();
