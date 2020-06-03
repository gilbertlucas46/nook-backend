export namespace PartnerAdminRequest {

    export interface CreatePartner {
        logoUrl: string;
        name: string;
        displayName?: string;

    }
    export interface UpdateStatus {
        partnerSid: string;
        status: string;
    }

}