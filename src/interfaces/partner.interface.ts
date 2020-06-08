export namespace PartnerAdminRequest {

    export interface CreatePartner {
        webUrl: string;
        logoUrl: string;
        name: string;
        displayName?: string;

    }
    export interface UpdateStatus {
        partnerSid: string;
        status: string;
    }


    export interface UpdatePartner {
        partnerSid: string;
        webUrl: string;
        logoUrl: string;
        name: string;
        displayName?: string;

    }

}