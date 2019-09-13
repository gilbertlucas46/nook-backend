import * as config from 'config';
import * as Constant from '../../constants/app.constant';
import * as ENTITY from '../../entity';
import * as utils from "../../utils/index";
const cert = config.get('jwtSecret');
/**
 * @author
 * @description this controller contains actions for admin's account related activities
 */

export class AdminController {
    constructor() { }

    getTypeAndDisplayName(findObj, number) {
        let obj = findObj;
        let data = Object.values(obj)
        var result = data.filter((x: any) => {
            return x.NUMBER == number
        });
        console.log('resultresultresult', result[0]);

        return result[0];
    }

    async getProperty(payload, adminData) {
        try {
            let { page, limit, sortBy, sortType } = payload

            if (!limit) limit = Constant.SERVER.LIMIT;
            else limit = limit;
            if (!page) page = 1;
            else page = page;
            let searchCriteria = {};
            let sortingType = {};
            sortType = !sortType ? -1 : sortType;
            // const matchObject = { $match: {} };
            let criteria: Object = {}

            if (sortBy) {
                switch (sortBy) {
                    case Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER:
                        sortBy = Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER
                        sortingType = {
                            "property_status.number.Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER": sortType
                        }
                        break;
                    case Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER:
                        sortBy = Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER
                        sortingType = {
                            "property_status.number.Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER": sortType
                        }
                        break;
                    default:
                        sortBy = 'createdAt';
                        sortingType = {
                            createdAt: sortType
                        }
                        break;
                }
            }
            else {
                sortBy = 'createdAt';
                sortingType = {
                    createdAt: sortType
                }
            }

            // Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER
            if (sortBy == 'createdAt') {
                criteria = {
                    $match: {
                        $or: [{ "property_status.number": Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER },
                        { "property_status.number": Constant.DATABASE.PROPERTY_STATUS.PENDING.NUMBER }]
                    },
                }
            } else {
                criteria = {
                    $match: {
                        'property_status.number': sortBy
                    },
                }
                // }
            }

            const pipeLine = [
                criteria,
                {
                    $sort: sortingType
                },
            ]

            let data = await ENTITY.PropertyE.ProprtyByStatus(pipeLine);
            // console.log('datadatadatadatadata', data);

            return data

        } catch (error) {
            utils.consolelog(error, 'error', true)
            return Promise.reject(error)
        }
    }

    async getPropertyById(payload: AdminRequest.PropertyDetail) {
        try {
            let criteria = {
                _id: payload.propertyId
            }
            let getPropertyData = await ENTITY.PropertyE.getOneEntity(criteria, {})
            if (!getPropertyData) {
                return Promise.reject(Constant.STATUS_MSG.ERROR.E400.INVALID_ID)
            }
            return getPropertyData;
        } catch (error) {
            utils.consolelog('error', error, true)
            return Promise.reject(error)
        }
    }

    async updatePropertyStatus(payload: AdminRequest.UpdatePropertyStatus, adminData) {
        try {
            let criteria = {
                _id: payload.propertyId
            }
            let result;
            let data_to_set: Object = {}

            if (payload.status == Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER)
                console.log('resultresultresult', result);

                data_to_set['$set'] = {
                    property_status: {
                        number: result.NUMBER,
                        status: result.TYPE,
                        displayName: result.DISPLAY_NAME
                    }
                }
            }
            else if (payload.status == Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
                result = this.getTypeAndDisplayName(Constant.DATABASE.PROPERTY_STATUS, Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER)
                console.log('resultresultresult', result);
                data_to_set['$set'] = {
                    property_status: {
                        number: result.NUMBER,
                        status: result.TYPE,
                        displayName: result.DISPLAY_NAME
                    }
                }
            }

            // if (payload.status == Constant.DATABASE.PROPERTY_STATUS.ACTIVE.NUMBER) {
            // data_to_set['$set'] = {
            //         property_status: {
            //             number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
            //             status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
            //             displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME
            //         }
            //     }
            // } 

            // else {
            // if (payload.status == Constant.DATABASE.PROPERTY_STATUS.DECLINED.NUMBER) {
            //     data_to_set['$set'] = {
            //         property_status: {
            //             number: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.NUMBER,
            //             status: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.TYPE,
            //             displayName: Constant.DATABASE.PROPERTY_STATUS.SOLD_RENTED.DISPLAY_NAME
            //         }
            //     }
            // }

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
            }

            let updateStatus = await ENTITY.PropertyE.updateOneEntity(criteria, data_to_set);
            console.log('updateStatusupdateStatus', updateStatus);
            return updateStatus;

        }
        catch (error) {
            utils.consolelog('error', error, true)
            return Promise.reject(error)
        }
    }
}

export let AdminService = new AdminController();

