export namespace AgentRequest {

    export interface SearchAgent {
        page?: number;
        limit?: number;
        sortBy?: string;
        searchTerm?: string;
        sortType?: number;
        fromDate?: number;
        toDate?: number;
        propertyType?: number;
        type?: string;
        label?: string[];
        cityId?: string;
        specializingIn_property_type?: number[];
        byCompanyName?: string;

    }
}
