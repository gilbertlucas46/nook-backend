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
        // propertyId?: string;
        // agentSpecialisation?: boolean;
        agentSpecialisation?: number;

    }
}
