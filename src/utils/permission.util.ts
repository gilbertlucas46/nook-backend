import * as Constant from '@src/constants/app.constant';
import * as UniversalFunctions from './utils';
import { log } from 'util';

export function checkPermission(adminData, modelName) {
    try {
        let checkReponse;
        if (modelName === Constant.DATABASE.PERMISSION.TYPE.LOAN) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
                }
            });
        }
        if (modelName === Constant.DATABASE.PERMISSION.TYPE.ARTICLE) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.ARTICLE) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.ARTICLE;
                }
            });
        }

        if (modelName === Constant.DATABASE.PERMISSION.TYPE.Article_Category) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.Article_Category) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.Article_Category;
                }
            });
        }
        if (modelName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                }
            });
        }
        if (modelName === Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.PRE_QUALIFICATION;
                }
            });
        }

        if (modelName === Constant.DATABASE.PERMISSION.TYPE.DASHBOARD) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.DASHBOARD) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.DASHBOARD;
                }
            });
        }
        if (modelName === Constant.DATABASE.PERMISSION.TYPE.USERS) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.USERS;
                }
            });
        }

        if (modelName === Constant.DATABASE.PERMISSION.TYPE.STAFF) {
            checkReponse = adminData['permission'].some(data => {
                if (data.moduleName === Constant.DATABASE.PERMISSION.TYPE.STAFF) {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.STAFF;
                }
            });
        }

        if (!checkReponse || checkReponse === undefined) {
            return Promise.reject(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
        }
    } catch (error) {
        console.log('checkPermissoincheckPermissoincheckPermissoin', error);
        return UniversalFunctions.sendError(error);
    }
}

// const checkPermission = adminData['permission'].some(data => {
//     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.LOAN;
// });
// if (checkPermission === false) {
//     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
// }