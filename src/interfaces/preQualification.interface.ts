export namespace PreQualificationRequest {
    export interface IPrequalificationList {
        limit: number;
        page: number;
        sortType?: number;
        sortBy?: string;
        fromDate: number;
        toDate: number;
        status?: string;
    }

    export interface IPreLoanAdd {
        preQualificationId?: string;
        userId?: string;  // for admin add and assisgn
        partnerName?: string;
        partnerId?: string;
        bankId?: string;
        property: {
            value: number;
            type: string;
            status: string;
            developer?: string;
        };
        employmentInfo: {
            type: string;
            rank: string;
            tenure: string;
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
            mobileNumber: string;
        };
        loan: {
            type: string;
            term: number;
            percent: number;
            amount: number;
            fixingPeriod: number;
        };
    }

    export interface IAdminPrequalificationList {
        page: number;
        limit: number;
        fromDate: number;
        toDate: number;
        sortType: number;
        propertyValue: number;
        propertyType: string;
        searchTerm: string;
        partnerName: string;
    }

    export interface IprequalificationDetail {
        id: string;
    }
}