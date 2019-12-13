import { BaseEntity } from '@src/entity/base/base.entity';
import * as Constant from '@src/constants/app.constant';
import { Types } from 'mongoose';
import { MailManager } from '@src/lib';
import { AdminRequest } from '@src/interfaces/admin.interface';

/**
 * @author
 * @description This controller contains actions by admin staff .
 */
class AdminUserE extends BaseEntity {
    constructor() {
        super('User');
    }

    async getUserList(payload: AdminRequest.IGetUSerList) {
        try {
            let { page, limit, sortBy, sortType } = payload;
            const { searchTerm, userId, type, status, fromDate, toDate } = payload;
            if (!limit) { limit = Constant.SERVER.LIMIT; }
            if (!page) { page = 1; }
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            const matchObject: any = { $match: {} };
            let searchCriteria = {};
            sortingType = {
                createdAt: sortType,
            };
            if (searchTerm) {
                // for filtration
                searchCriteria = {
                    $match: {
                        $or: [
                            { userName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { email: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { firstName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { middleName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { lastName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { title: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { phoneNumber: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { companyName: new RegExp('.*' + searchTerm + '.*', 'i') },
                            { aboutMe: new RegExp('.*' + searchTerm + '.*', 'i') },
                        ],
                    },
                };
            } else {
                searchCriteria = {
                    $match: {
                    },
                };
            }

            if (sortBy) {
                switch (sortBy) {
                    case 'userName':
                        sortBy = 'userName';
                        sortingType = {
                            userName: sortType,
                        };
                        break;
                    case 'date':
                        sortBy = 'date';
                        sortingType = {
                            updatedAt: sortType,
                        };
                        break;
                    case 'email':
                        sortBy = 'email';
                        sortingType = {
                            email: sortType,
                        };
                        break;
                    case 'firstName':
                        sortBy = 'firstName';
                        sortingType = {
                            firstName: sortType,
                        };
                        break;
                    case 'middleName':
                        sortBy = 'middleName';
                        sortingType = {
                            middleName: sortType,
                        };
                        break;
                    case 'lastName':
                        sortBy = 'lastName';
                        sortingType = {
                            lastName: sortType,
                        };
                        break;
                    default:
                        sortBy = 'updatedAt';
                        sortingType = {
                            updatedAt: sortType,
                        };
                        break;
                }
            }
            if (!status) {
                matchObject.$match = {
                    $or: [{
                        status: Constant.DATABASE.STATUS.USER.ACTIVE,
                    }, {
                        status: Constant.DATABASE.STATUS.USER.BLOCKED,
                    },
                    ],
                };
            }

            if (userId) { matchObject.$match._id = Types.ObjectId(userId); }
            if (type) { matchObject.$match['type'] = type; }
            if (status) { matchObject.$match['status'] = status; }

            // Date filters
            if (fromDate && toDate) { matchObject.$match['createdAt'] = { $gte: fromDate, $lte: toDate }; }
            if (fromDate && !toDate) { matchObject.$match['createdAt'] = { $gte: fromDate }; }
            if (!fromDate && toDate) { matchObject.$match['createdAt'] = { $lte: toDate }; }

            const query = [
                matchObject,
                searchCriteria,
                {
                    $sort: sortingType,
                },
                {
                    $project: {
                        _id: 1,
                        fullName: 1,
                        type: 1,
                        userName: 1,
                        updatedAt: 1,
                        createdAt: 1,
                        email: 1,
                        phoneNumber: 1,
                        firstName: 1,
                        middleName: 1,
                        // userId: '$_id',
                        status: 1,
                    },
                },
            ];
            return await this.DAOManager.paginate(this.modelName, query, limit, page);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    sendInvitationMail(payload: any, genCredentials: string) {
        const html = `<html><head><title> Nook Admin | User Credentials</title></head>
                        <body>
                        Your system generated password is : '${genCredentials}'
                        <p>Login with your email and password sent above.</p>
                        </body>
                        </html>`;

        const sendObj = {
            receiverEmail: payload,
            subject: 'agent Login Credentials',
            content: html,
        };

        const mail = new MailManager();
        mail.sendMail(sendObj);
    }
}

export const AdminUserEntity = new AdminUserE();