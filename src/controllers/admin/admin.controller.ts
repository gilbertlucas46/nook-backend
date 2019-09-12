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

    async getPropertyByStatus(payload, adminData) {
        try {
            let criteria = {
                $match: {
                    "property_status.number": payload.propertyStatus,
                },
            }
            const pipeLine = [
                criteria,
                // {
                //     $sort: sortingType
                // },
            ]
            let data = await ENTITY.PropertyE.ProprtyByStatus(pipeLine);
            console.log('datadatadatadatadata', data);

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
}

export let AdminService = new AdminController();

