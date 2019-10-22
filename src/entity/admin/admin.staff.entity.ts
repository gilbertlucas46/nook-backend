import { BaseEntity } from '@src/entity/base/base.entity';
import * as moment from 'moment';
import * as CONSTANT from '../../constants';
import { Types } from 'mongoose';
import { MailManager } from '@src/lib';

/**
 * @author
 * @description This controller contains actions by admin staff .
 */
class AdminStaffE extends BaseEntity {
    constructor() {
        super('Admin');
    }

    async checkStaffEmail(email: string) {
        return this.getOneEntity({ email }, {});
    }

    async checkPermission(permission: string) {
        const data = await this.getOneEntity({ permission: { $in: permission } }, {});
        if (!data) {
            return Promise.reject(CONSTANT.STATUS_MSG.ERROR.E401);
        } else {
            return data;
        }
    }

    async fetchAdminEmail(id: string) {
        const query = {
            _id: Types.ObjectId(id),
            staffLoggedIn: false,
            type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
        };
        return this.getOneEntity(query, {});
    }

    async staffListing(payload: any) {
        const { fromDate, toDate } = payload;
        let { limit, page, sortType } = payload;
        const matchCondition: any = {
            type: CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE,
            staffStatus: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
        };
        const pipeline = [];
        const sortCondition: any = {};
        if (!limit) { limit = CONSTANT.SERVER.LIMIT; }
        if (!page) page = 1;
        if (!sortType) sortType = 1;
        if (payload.sortBy) {
            sortCondition[payload.sortBy] = parseInt(payload.sortType);
            pipeline.push({ $sort: sortCondition });
        }

        if (fromDate || toDate) {
            matchCondition['createdAt'] = {};
            if (fromDate) matchCondition['createdAt']['$gte'] = moment(fromDate).startOf('day').toDate();
            if (toDate) matchCondition['createdAt']['$lte'] = moment(toDate).endOf('day').toDate();
        }
        pipeline.push(
            {
                $match: matchCondition,
            },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phoneNumber: 1,
                    staffLoggedIn: 1,
                    createdAt: 1,
                    permission: 1,
                },
            });
        return this.DAOManager.paginate(this.modelName, pipeline, limit, page);
    }

    sendInvitationMail(payload: string, genCredentials: string) {
        const html = `<html><head><title> Nook Admin | Staff Credentials</title></head>
                        <body>
                        Your system generated password is : '${genCredentials}'
                        <p>Login with your email and password sent above.</p>
                        </body>
                        </html>`;
        const mail = new MailManager(payload, 'Staff Login Credentials', html);
        mail.sendMail();
    }
}

export const AdminStaffEntity = new AdminStaffE();