export namespace LoanRequest {

    export interface PreLoan {
        property: {
            value: number;
            type: string;
            status: string;
        };
        work: {
            type: string;
            rank: string;
            tenure: number;
            income: number;
        };
        other: {
            age: number;
            nationality: string;
            localVisa: boolean,
            creditCard: {
                status: string;
                limit?: number,
                cancelled: boolean;
            },
            prevLoans: {
                status: boolean;
                monthlyTotal?: number;
                remainingTotal?: number;
            },
            otherIncome: {
                status: boolean;
                monthlyIncome?: number;
            },
            married: {
                status: boolean;
                spouseMonthlyIncome?: number;
            },
            coBorrower: {
                status: boolean;
                coBorrowerMonthlyIncome?: number;
            },
            isCoBorrower: boolean;
        };
        loan: {
            type: string;
            term: number;
            percent: number;
            amount: number;
        };
    }
}
