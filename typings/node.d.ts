/// <reference types='node' />

declare namespace NodeJS {
	/**
	 * It is used to store couting number of documents so that a unique id can added to the documents.
	 */
	export interface Counters {
		LoanApplication: number;
	}


	export interface Global {
		counters: Counters
	}
}

// some import 
// AND/OR some export
