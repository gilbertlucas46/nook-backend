export namespace helpCenterRequest {

    export interface CreateHelpCenter {
        title: string;
        description: string;
        videoUrl: string;
        categoryId: number;
        categoryType: string;
    }

    export interface GetHelpCenter {
        id: number;
    }
    export interface DeleteHelpCenter {
        id: string;
    }
    export interface IsHelpful {
        isHelpful: boolean;
    //    _id: string;
        ipAddress: string;
        helpCenterId: string;
    }

}