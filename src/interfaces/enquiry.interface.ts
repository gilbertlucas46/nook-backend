
export namespace EnquiryRequest {

	export interface CreateEnquiry {
		name: string;
		phoneNumber: string;
		email: string;
		message?: string;
		// userId?: string;
		propertyId: string;
		enquiryType: string;
		propertyOwnerId: string;
		agentEmail?: string;
		// propertyOwnerEmail?: string;
		agentId?: string;
		propertyOwnerEmail?: string;
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