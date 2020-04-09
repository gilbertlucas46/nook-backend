export namespace PreQualificationRequest {
    export interface IPrequalificationList {
        limit: number;
        page: number;
        sortType?: number;
        sortBy?: string;
        fromDate: number;
        toDate: number;
        status?: string;
    }

}
