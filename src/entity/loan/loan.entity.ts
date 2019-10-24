import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanRequest } from './../../interfaces/loan.interface';
import * as Constant from '@src/constants';

class LoanEntities extends BaseEntity {
    constructor() {
        super('Bank');
    }

    async preloan(payload: LoanRequest.PreLoan) {
        try {
            let totalMonthlyIncome = payload.work.income;
            if (payload.other.married.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.married.spouseMonthlyIncome;
            if (payload.other.coBorrower.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.coBorrower.coBorrowerMonthlyIncome;
            if (payload.other.otherIncome.status) totalMonthlyIncome = totalMonthlyIncome + payload.other.otherIncome.monthlyIncome;
            const pipeline = [
                {
                    $match: {
                        loanMinAmount: { $lte: payload.property.value },
                        propertySpecification: {
                            $elemMatch: {
                                $and: [
                                    { allowedPropertyType: payload.property.type },
                                    { allowedPropertyStatus: payload.property.status },
                                    { maxLoanDurationAllowed: { $gte: payload.loan.term } },
                                    { maxLoanPercent: { $gte: payload.loan.percent } },
                                    // missed loan payment condition need to be added.
                                ],
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'userloancriterias',
                        let: { bank_Id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$bankId', '$$bank_Id'],
                                    },
                                },
                            },
                            // {
                            //     $project: {
                            //         name: 1,
                            //         _id: 1,
                            //     },
                            // },
                        ],
                        as: 'userloan',
                    },
                },
                {
                    $unwind: {
                        path: '$userloan',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        // Used different $match basically to handle some other conditions. will optimize later once we get the complete requirement.
                        // need to apply conditions based based on total income of borrower spouse(ifAny) and coborrower(ifAny) and the total assets(ifAny)
                        'userloan.loanForEmploymentType': {
                            $elemMatch: {
                                $and: [
                                    { employmentType: payload.work.type },
                                    { employmentRank: payload.work.rank },
                                    { minEmploymentTenure: { $lte: Constant.EMPLOYMENT_TENURE[`${payload.work.tenure}`].value.min } },
                                ],
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        interestRate: `$interestRateDetails.${payload.loan.term}`,
                        loanableAmount: payload.loan.amount,
                        loanDurationYearly: payload.loan.term,
                        loanApplicationFeeAmount: 0,
                    },
                },
                {
                    $addFields: {
                        interestRateMonthly: { $divide: [{ $divide: ['$interestRate', 100] }, 12] },
                        loanDurationMonthly: { $multiply: [payload.loan.term, 12] },
                    },
                },
                {
                    $addFields: {
                        numerator1: { $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] },
                        denominator: { $subtract: [{ $pow: [{ $add: ['$interestRateMonthly', 1] }, '$loanDurationMonthly'] }, 1] },
                    },
                },
                {
                    $addFields: {
                        numerator: { $multiply: ['$numerator1', '$interestRateMonthly', payload.loan.amount] },
                    },
                },
                {
                    $project: {
                        abbrevation: 1,
                        totalPrice: 1,
                        bankName: 1,
                        headquarterLocation: 1,
                        bankFeePercent: 'up to 2%',
                        bankFeeAmount: 1,
                        loanApplicationFeePercent: 1,
                        loanApplicationFeeAmount: 1,
                        bankImageLogoUrl: 1,
                        processingTime: '5-7 working days',
                        interestRate: 1,
                        loanDuration: 1,
                        monthlyPayment: { $divide: ['$numerator', '$denominator'] },
                        totalLoanPayment: 1,
                        bankId: '$_id',
                        _id: 0,
                        loanableAmount: 1,
                        loanDurationYearly: 1,
                        loanDurationMonthly: 1,
                    },
                },
                {
                    $match : {
                        monthlyPayment: { $lte: totalMonthlyIncome }},
                },
            ];

            const bankList = await this.DAOManager.aggregateData(this.modelName, pipeline);
            return bankList;

        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export const LoanEntity = new LoanEntities();
