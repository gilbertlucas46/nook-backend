export namespace helpCenterRequest {

    export interface CreateHelpCenter {
        title: string;
        description: string;
        videoUrl: string;
        categoryId: number;
        categoryType: string;
        type: string;
    }

    export interface GetHelpCenter {
        id: number;
        type: string,
    }

    export interface AdminGetHelpCnter {
        categoryId: string
        page: number;
        limit: number;
        searchTerm: string;
        sortType: number
    }
    export interface DeleteHelpCenter {
        id: string;
    }
    export interface IsHelpful {
        isHelpful: boolean;
        ipAddress: string;
        helpCenterId: string;
    }

    export interface IupdateHelpCenter {
        id?: string;
        title?: string;
        videoUrl?: string;
        description?: string;
        categoryId?: number;
        type: string;
    }

    export interface IhelpcenterCategoryAdd {
        name: string;
        category: string;
        //  title:string ;
    }
    export interface IhelpCenterCategoryUpdate {
        categoryId: string;
        name: string;
        status: string;
        //  title:string ;
    }

}