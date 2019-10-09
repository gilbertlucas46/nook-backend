export namespace SavePropertyRequest {

    export interface SaveProperty {
        propertyId?: string;
    }

    export interface SavePropertyList {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortType?: number;
    }
}