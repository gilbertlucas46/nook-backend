import { BaseEntity } from '@src/entity/base/base.entity';
import { LoanRequest } from './../../interfaces/loan.interface';
class LoanEntities extends BaseEntity {
    constructor() {
        super('Bank');
    }

    async preloan(payload: LoanRequest.PreLoan) {
        try {
            const pipeline = [{
                $match: {
                    loanForForeignerMarriedLocal: true,
                },
            },
            {
                $addFields: {
                    interestRate: 1,
                    loanDuration: 1,
                    monthlyPayment: 1,
                    totalLoanPayment: 1,
                },
            },
            {
                $project: {
                    abbrevation: 1,
                    bankName: 1,
                    headquarterLocation: 1,
                    bankFeePercent: 1,
                    bankFeeAmount: 1,
                    loanApplicationFeePercent: 1,
                    bankImageLogoUrl: 1,
                    processingTime: '5-7 days',
                    interestRate: 1,
                    loanDuration: 1,
                    monthlyPayment: 1,
                    totalLoanPayment: 1,
                    bankId: '$_id',
                },
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
