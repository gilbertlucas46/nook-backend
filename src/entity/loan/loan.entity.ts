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
                $project: {
                    loanForForeigner: 1,
                    loanForForeignerMarriedLocal: 1,
                    loanForNonCreditCardHolder: 1,
                    loanForCreditCardHolder: 1,
                    loanForNotNowCreditCardHolder: 1,
                    loanAlreadyExistDiffBank: 1,
                    loanAlreadyExistSameBank: 1,
                    missedLoanPaymentAllowance: 1,
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
