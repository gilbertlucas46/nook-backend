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
        // viewCount: number;
        status: number;
        // shareCount: Joi.number(),
        categoryType: string;
        categoryId: number;
        userId: string;
        createdAt: number;
        updatedAt: number;
        isFeatured: boolean;
    }

    export interface GetArticle {
        limit: number;
        page: number;
        sortBy: string;
        sortType: number;
        categoryId: number;
        articleId: string;

    }
    export interface GetArticleById {
        articleId: string;
    }
    export interface UpdateArticle {
        categoryId: number;
        imageUrl: string;
        title: string;
        description: string;
        articleId: string;
    }
    export interface DeleteArticle {
        articleId: string;
    }

}