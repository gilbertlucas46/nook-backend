export namespace TransactionRequest {

	export interface CreateCharge {
		amount: number;
		currency: string;
		source: string;
		description: string;
		featuredType: string;
		billingType: string;
		subscriptionId: string;
		userId: string;
	}

	export interface InvoiceList {
		limit: number;
		page: number;
		featuredType?: string;
	}
}