import { Types } from 'mongoose';
import * as Joi from 'joi';
import * as UniversalFunctions from '@src/utils';
import * as Constant from '@src/constants/app.constant';
import * as ENTITY from '@src/entity';
import { ResponseToolkit, ServerRoute } from 'hapi';

import { LogRequest } from '@src/interfaces/auditTrail.interface';


export let auditTrailRoute: ServerRoute[]=[
 /**
 * @author Shivam Singh
 * @description: get all updated log on admin end 
 *
 */

{
    method: 'GET',
    path: '/v1/admin/auditTrail',
    handler: async (request, h) => {
        try {
            const adminData = request.auth && request.auth.credentials && (request.auth.credentials as any).adminData;
            const payload:LogRequest.IauditTrailList=request.query as any;
            const permission = await UniversalFunctions.checkPermission(adminData, Constant.DATABASE.PERMISSION.TYPE.LOAN);
            const data= await ENTITY.HistoryE.updateHistoryList(payload);
            return (UniversalFunctions.sendSuccess(Constant.STATUS_MSG.SUCCESS.S200.DEFAULT, data));
        } catch (error) {
            UniversalFunctions.consolelog('error', error, true);
            return (UniversalFunctions.sendError(error));
        }
    },
    options: {
        description: 'get updateLogs on admin end',
        tags: ['api', 'anonymous', 'admin', 'AuditTrail'],
        auth: 'AdminAuth',
        validate: {
            query: {
                loanId: Joi.string().required(),
                limit: Joi.number(),
                page: Joi.number(),
                // sortType: Joi.number().valid([Constant.ENUM.SORT_TYPE]),
                // sortBy: Joi.string().default('date'),
                // fromDate: Joi.number(),
                // toDate: Joi.number(),
                // status: Joi.string(),
                // partnerId: Joi.string(),
            },
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction,
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: Constant.swaggerDefaultResponseMessages,
            },
        },
    },
},



]