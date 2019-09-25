export namespace ArticleRequest {

    export interface CreateArticle {
        userRole: string;
        imageUrl: string;
        title: string;
        description: string;
        status: number;
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