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
        sortBy?: string;
        sortType?: number;
        categoryId?: number;
        articleId?: string;
        searchTerm: string;
        fromDate?: number;
        toDate?: number;
        isFeatured?: boolean;

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
        isFeatured?: boolean;
    }
    export interface DeleteArticle {
        articleId: string;
    }

}