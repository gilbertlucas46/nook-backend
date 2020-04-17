import { BaseEntity } from '@src/entity/base/base.entity';
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
        if (!data) return Promise.reject(CONSTANT.STATUS_MSG.ERROR.E401);
        else return data;
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
        const { fromDate, toDate, permissionType, searchTerm, status } = payload;
        let { limit, page, sortType } = payload;
        const pipeline = [];
        const sortCondition: any = {};
        if (!limit) { limit = CONSTANT.SERVER.LIMIT; }
        if (!page) page = 1;
        if (!sortType) sortType = 1;
        if (payload.sortBy) {
            sortCondition[payload.sortBy] = parseInt(payload.sortType);
            // pipeline.push({ $sort: sortCondition });
        }
        let searchCondition: any = {};
        const matchCondition: any = {};
        matchCondition['type'] = CONSTANT.DATABASE.USER_TYPE.STAFF.TYPE;

        if (permissionType) {
            matchCondition['permission'] = { $elemMatch: { moduleName: permissionType } };
        }
        if (status) {
            matchCondition['staffStatus'] = status;
        } else {
            matchCondition['$or'] =
                [{
                    staffStatus: CONSTANT.DATABASE.STATUS.USER.ACTIVE,
                }, {
                    staffStatus: CONSTANT.DATABASE.STATUS.USER.BLOCKED,
                },
                ];
        }


        if (searchTerm) {
            searchCondition['$or'] = [
                // $or: [
                { name: new RegExp('.*' + searchTerm + '.*', 'i') },
                { email: new RegExp('.*' + searchTerm + '.*', 'i') },
                { firstName: new RegExp('.*' + searchTerm + '.*', 'i') },
                // ],
            ]
        } else {
            searchCondition = {

            }
        }

        if (fromDate || toDate) {
            // Date filters
            if (fromDate && toDate) { matchCondition['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchCondition['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchCondition['createdAt'] = { $lte: toDate }; }
            //     matchCondition['createdAt'] = {};
            //     if (fromDate) matchCondition['createdAt']['$gte'] = fromDate;
            //     if (toDate) matchCondition['createdAt']['$lte'] = toDate; // moment(toDate).endOf('day').toDate();
        }
        pipeline.push(
            {
                $match: matchCondition,
            },
            {
                $match: searchCondition,
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
                    staffStatus: 1,
                },
            },
            {
                $sort: {
                    updatedAt: sortType,
                },
            });
        return await this.DAOManager.paginate(this.modelName, pipeline, limit, page);
    }

    sendInvitationMail(payload: any, genCredentials: string) {
        // const html = 
        // `<html><head><title> Nook Admin | Staff Credentials</title></head>
        //                 <body>
        //                 Dear User,
        //                 <br>
        //                 You are registered as a Nook Staff member. Use your email address and password: '${genCredentials}' to login.Cheers!
        //                 <p>Login with your email and password sent above.</p>
        //                 <br>
        //                 <p>regards</p>
        //                 <br>
        //                 <Nook Team>
        //                 </body>
        //                 </html>`;

        const sendObj = {
            receiverEmail: payload,
        };

        const mail = new MailManager();
        mail.welcomeStaffUSer(sendObj);
    }
}

export const AdminStaffEntity = new AdminStaffE();