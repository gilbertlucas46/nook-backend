export namespace helpCenterRequest {

    export interface CreateHelpCenter {
        title: string;
        description: string;
        videoUrl: string;
        categoryId: number;
        categoryType: string;
    }

    export interface GetHelpCenter {
        categoryId: number;
    }
    export interface DeleteHelpCenter {
        id: string;
    }
}