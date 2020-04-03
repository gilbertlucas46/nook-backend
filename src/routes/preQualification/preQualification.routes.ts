import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { helpCenterRequest } from '@src/interfaces/helpCenter.interface';
import { HelpCenterService } from '@src/controllers/helpCenter/helpCenter.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';
export let helpCenterRoute: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/user/prequalification',
        handler: async (request, h) => {
            try {
                const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
                const payload: helpCenterRequest.CreateHelpCenter = request.payload as any;
                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                const checkPermission = adminData['permission'].some(data => {
                    return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                });

                if (checkPermission === false) {
                    return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                }

                const data = await HelpCenterService.createHelpCenter(payload, adminData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, data);
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'update account type ',
            tags: ['api', 'anonymous', 'user', 'updateAccount'],
            auth: 'AdminAuth',
            validate: {
                payload: {
                    title: Joi.string().trim(),
                    videoUrl: Joi.string().trim().allow(''),
                    description: Joi.string().trim(),
                    categoryId: Joi.number().valid([
                        Constant.DATABASE.HELP_CENTER_TYPE.ACCOUNT.NUMBER,
                        // Constant.DATABASE.HELP_CENTER_TYPE.BILLING.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.HOME_LOANS.NUMBER,
                        // Constant.DATABASE.HELP_CENTER_TYPE.PROPERTIES.NUMBER,
                        Constant.DATABASE.HELP_CENTER_TYPE.FAQ.NUMBER,
                    ]),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
];