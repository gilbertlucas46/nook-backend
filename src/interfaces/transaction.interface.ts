export namespace TransactionRequest {

	export interface Id {
		transactionId: string;
	}

	export interface CreateCharge {
		amount: number;
		currency: string;
		source: string;
		description: string;
		featuredType: string;
		billingType: string;
		subscriptionId: string;
		userId: string;
		name: string;
		address: string;
	}

	export interface InvoiceList {
		limit: number;
		page: number;
		featuredType?: string;
		fromDate?: number;
		toDate?: number;
	}
}