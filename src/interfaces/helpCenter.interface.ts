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
    }
}