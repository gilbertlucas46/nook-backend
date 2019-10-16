import { BaseEntity } from '@src/entity/base/base.entity';
import * as config from 'config';
import * as Jwt from 'jsonwebtoken';
const cert: any = config.get('jwtSecret');
import * as utils from '@src/utils';
import { UserRequest } from '@src/interfaces/user.interface';
import { AdminRequest } from '@src/interfaces/admin.interface';
import * as CONSTANT from '../../constants';
import { Types } from 'mongoose';

/**
 * @author
 * @description This controller contains actions by admin staff .
 */
class adminStaffE extends BaseEntity {
    constructor() {
        super('Admin');
    }

    async checkStaffEmail(email: string) {
        let query = {
            email
        }
        return this.getOneEntity(query, {})
    }

    async checkPermission(permission: string) {
       let data = await this.getOneEntity({ permission: { $in: [permission] } }, {});
       if (data) {
        return Promise.reject(CONSTANT.STATUS_MSG.ERROR.E401);
       } else {
           return true
       }
    }

    async fetchAdminEmail(id: string) {
        let query = {
            _id: Types.ObjectId(id)
        }
        return this.getOneEntity(query, {});
    }

    async staffListing(payload: any) {
        const { fromDate, toDate } = payload;
        let { sortType, limit, page } = payload;
        let query: any = {};
        if (!limit) { limit = CONSTANT.SERVER.LIMIT; }
        if (!page) { page = 1; } 
        sortType = !sortType ? -1 : sortType;
        sortType = !sortType ? -1 : 1;
        const sortingType = {
            createdAt: sortType,
        };
        let createdAt;

        // query = { propertyOwnerId: userData._id };
        if (fromDate && toDate) {
            createdAt = {
                $gte: fromDate,
                $lte: toDate,
            };
            query = {
                query,
                createdAt,
            };
        }
        else if (toDate) {
            createdAt = {
                $lte: new Date().getTime(),
            };
            query = {
                query,
                createdAt,
            };
        } else if (fromDate) {
            createdAt = {
                $gte: new Date().getTime(),
            };
            query = {
                query,
                createdAt,
            };
        }
        let matchCondition = {
            type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
            staffStatus: CONSTANT.DATABASE.STATUS.USER.ACTIVE
        }
        let pipeline = [];
        pipeline.push({
            $match: matchCondition
        },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phoneNumber: 1,
                    createdAt: 1,
                    permission: 1
                }
            });
        return this.DAOManager.paginate(this.modelName, pipeline, limit, page);
    }
}

export const AdminStaffEntity = new adminStaffE();