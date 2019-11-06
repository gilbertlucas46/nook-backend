export namespace loanReferralRequest {

    export interface CreateReferral {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        notes: string;
    }

    export interface GetReferral {
        referralId: string;
    }
}