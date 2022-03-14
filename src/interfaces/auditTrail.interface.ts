import { ObjectId } from 'bson';
export namespace LogRequest {
    export interface IauditTrailList {
        loanId: string;
        limit: number;
        page: number;
    }
}