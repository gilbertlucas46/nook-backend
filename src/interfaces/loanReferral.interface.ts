export namespace loanReferralRequest {

    export interface CreateReferral {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        notes: string;
        status?: string;
        countryCode: string;
    }

    export interface GetReferral {
        referralId: string;
    }

    export interface IUserLoanRefferal {
        page: number;
        limit: number;
        sortBy?: string;
        sortType?: number;
        searchTerm: string;
        fromDate?: number;
        toDate?: number;
    }

    export interface IAdminLoanReferral {
        page: number;
        limit: number;
        sortBy?: string;
        sortType?: number;
        searchTerm: string;
        fromDate?: number;
        toDate?: number;
    }
}