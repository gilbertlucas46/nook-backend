import { ServerRoute } from 'hapi';
import * as UniversalFunction from '../../utils';
import { PreQualificationService } from '@src/controllers/preQualification/preQualification.controller';
import * as UniversalFunctions from '../../utils';
import * as Constant from '../../constants';
import * as Joi from 'joi';


const objectSchema = Joi.object({
    // accessLevel: Joi.number().valid([CONSTANT.PRIVILEGE.SUB_ADMIN_PRIVILEGE]).default(2),
    abbrevation: Joi.string(), // "CTBC",
    bankName: Joi.string(), // "CTBC Bank",
    headquarterLocation: Joi.string(), // "Taiwan",
    loanForCancelledCreditCard: Joi.boolean(), // true,
    bankFeeAmount: Joi.number(), // 0,
    loanApplicationFeePercent: Joi.number(), // 0,
    logoUrl: Joi.string(), // "/assets/banking/ctbc-bank/logo.png",
    iconUrl: Joi.string(), // "/assets/banking/ctbc-bank/icon.jpg",
    bannerUrl: Joi.string(), //  "/assets/banking/ctbc-bank/banner.jpg",
    interestRate: Joi.number(), // 7,
    loanableAmount: Joi.number(), // 1876542,
    loanDurationYearly: Joi.number(), // 2,
    loanApplicationFeeAmount: Joi.number(), // 0,
    fixingPeriod: Joi.number(), // 1,
    grossIncome: Joi.number(), // 98765432,
    loanDurationMonthly: Joi.number(), // 24,
    bankFeePercent: Joi.string(), // "up to 2%",
    processingTime: Joi.string(), // "As fast as 5 working days upon submission of complete documents",
    totalLoanMonthly: Joi.number(), // 84017.6251353744,
    monthlyPayment: Joi.number(), // 84017.6251353744,
    bankId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),                    // ObjectId("5da840c71591fd46673194b3"),
    debtIncomePercentRatio: Joi.number(), // 0.0850678455346345,
    debtIncomeRatio: Joi.number(), // 30,
    maxLoanDurationAllowed: Joi.number(), // 20
});

export let preQualificationroutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/v1/user/prequalification',
        handler: async (request, h) => {
            try {
                const userData = request.auth && request.auth.credentials && (request.auth.credentials as any).userData;
                const payload = request.payload as any;

                // if (adminData.type === Constant.DATABASE.USER_TYPE.STAFF.TYPE) {
                //     await ENTITY.AdminStaffEntity.checkPermission(Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER);
                // }

                // const checkPermission = adminData['permission'].some(data => {
                //     return data.moduleName === Constant.DATABASE.PERMISSION.TYPE.HELP_CENTER;
                // });

                // if (checkPermission === false) {
                //     return UniversalFunctions.sendError(Constant.STATUS_MSG.ERROR.E401.UNAUTHORIZED);
                // }

                const data = await PreQualificationService.addPreQualifiedBanks(payload, userData);
                return UniversalFunction.sendSuccess(Constant.STATUS_MSG.SUCCESS.S201.CREATED, {});
            } catch (error) {
                UniversalFunctions.consolelog(error, 'error', true);
                return (UniversalFunction.sendError(error));
            }
        },
        options: {
            description: 'user prqualification Bank ',
            tags: ['api', 'anonymous', 'user', 'bank', 'add', 'prequalification'],
            auth: 'UserAuth',
            validate: {
                payload: {
                    prequalifiedBanks: Joi.array().items(objectSchema),
                },
                headers: UniversalFunctions.authorizationHeaderObj,
                failAction: UniversalFunctions.failActionFunction,
            },
        },
    },
];