declare namespace EnquiryRequest {

    export interface createEnquiry {

        name: string;
        phoneNumber: string
        email: string;
        message?: string
        userId: string;
        propertyId: string,
        type: string
        // propertOwner_id?: string
        // enquiryBy?: string
    }

    export interface getEnquiry {
        userId: string
    }
    
    export interface getInquiryById{
        enquiryId:string
    }


}