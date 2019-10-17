
export namespace EnquiryRequest {

	export interface CreateEnquiry {
		name: string;
		phoneNumber: string;
		email: string;
		message?: string;
		// userId?: string;
		propertyId: string;
		type: string;
		propertOwner_id?: string;
		agentEmail?: string;
	}

	export interface GetEnquiry {
		page?: number;
		limit?: number;
		fromDate: number;
		toDate: number;
		sortType?: number;
	}
	export interface GetInquiryById {
		enquiryId: string;
	}

}