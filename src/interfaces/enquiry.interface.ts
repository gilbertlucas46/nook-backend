export namespace EnquiryRequest {

	export interface CreateEnquiry {
		name: string;
		phoneNumber: string;
		email: string;
		message?: string;
		userId?: string;
		propertyId: string;
		type: string;
		propertOwner_id?: string;
	}

	export interface GetEnquiry {
		fromDate: number;
		toDate: number;
	}
	export interface GetInquiryById {
		enquiryId: string;
	}

}