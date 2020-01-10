export namespace TransactionRequest {

	export interface Id {
		transactionId: string;
	}

	export interface CreateCharge {
		// amount: number;
		// currency: string;
		source: string;
		// description: string;
		// featuredType: string;
		// billingType: string;
		// subscriptionId: string;
		// userId: string;
		planId: string;
		name: string;
		address: string;
		propertyId?: string;
		cancel_at_period_end?: string,
	}

	export interface InvoiceList {
		limit: number;
		page: number;
		// name: string;
		featuredType?: string;
		fromDate?: number;
		toDate?: number;
	}
}