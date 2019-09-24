export namespace ArticleRequest {

    export interface CreateArticle {
        // uploadBy: {
        //     name: string;
        //     userId: string;
        //     type: string;
        // };
        // category: string;
        // userId: string;
        // description: string;
        // viewCount?: string;
        // shareCount?: string;
        // articleAction?: object[];
        userRole: string;
        imageUrl: string;
        title: string;
        description: string;
        viewCount: number;
        // shareCount: Joi.number(),
        categoryType: string;
        categoryId: number;
        userId: string;
    }

}