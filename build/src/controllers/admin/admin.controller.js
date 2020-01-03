"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const Constant = require("../../constants/app.constant");
const ENTITY = require("../../entity");
const utils = require("../../utils/index");
const cert = config.get('jwtSecret');
class AdminController {
    constructor() { }
    getTypeAndDisplayName(findObj, number) {
        let obj = findObj;
        let data = Object.values(obj);
        var result = data.filter((x) => {
            return x.NUMBER == number;
        });
        console.log('resultresultresult', result[0]);
        return result[0];
    }
    async getProperty(payload, adminData) {
        try {
            let { page, limit, sortBy, sortType } = payload;
            if (!limit)
                limit = Constant.SERVER.LIMIT;
            else
                limit = limit;
            if (!page)
                page = 1;
            else
                page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            let criteria = {};
            if (sortBy) {
                switch (sortBy) {
                    case Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER:
                        sortBy = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER;
                        sortingType = {
                            "property_status.number.Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER": sortType
                        };
                        break;
                    case Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER:
                        sortBy = Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER;
                        sortingType = {
                            "property_status.number.Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER": sortType
                        };
                        break;
                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        };
                        break;
                }
            }
            else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                };
            }
            if (sortBy == 'createdAt') {
                criteria = {
                    $match: {
                        $or: [{ "property_status.number": Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
                            { "property_status.number": Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER }]
                    },
                };
            }
            else {
                criteria = {
                    $match: {
                        'property_status.number': sortBy
                    },
                };
            }
            const pipeLine = [
                criteria,
                {
                    $sort: sortingType
                },
            ];
            let data = await ENTITY.PropertyE.ProprtyByStatus(pipeLine);
            return data;
        }
        catch (error) {
            utils.consolelog(error, 'error', true);
            return Promise.reject(error);
        }
    }
    async getPropertyById(payload) {
        try {
            let criteria = {
                _id: payload.propertyId
            };
            let getPropertyData = await ENTITY.PropertyE.getOneEntity(criteria, {});
            if (!getPropertyData) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID);
            }
            return getPropertyData;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
    async updatePropertyStatus(payload, adminData) {
        try {
            let criteria = {
                _id: payload.propertyId
            };
            let result;
            let data_to_set = {};
            if (payload.status == Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER);
                console.log('resultresultresult', result);
                data_to_set['$set'] = {
                    property_status: {
                        number: result.NUMBER,
                        status: result.TYPE,
                        displayName: result.DISPLAY_NAME
                    }
                };
            }
            else if (payload.status == Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER);
                console.log('resultresultresult', result);
                data_to_set['$set'] = {
                    property_status: {
                        number: result.NUMBER,
                        status: result.TYPE,
                        displayName: result.DISPLAY_NAME
                    }
                };
            }
            data_to_set['$push'] = {
                propertyActions: {
                    actionNumber: result.NUMBER,
                    actionString: result.TYPE,
                    actionPerformedBy: {
                        userId: adminData._id,
                        userTypeNumber: "",
                        userTypeString: adminData.TYPE
                    },
                    actionTime: new Date().getTime()
                }
            };
            let updateStatus = await ENTITY.PropertyE.updateOneEntity(criteria, data_to_set);
            console.log('updateStatusupdateStatus', updateStatus);
            return updateStatus;
        }
        catch (error) {
            utils.consolelog('error', error, true);
            return Promise.reject(error);
        }
    }
}
exports.AdminController = AdminController;
exports.AdminService = new AdminController();
//# sourceMappingURL=admin.controller.js.map