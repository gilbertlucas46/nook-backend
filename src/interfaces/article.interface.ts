export namespace ArticleRequest {

    export interface CreateArticle {
        userRole: string;
        imageUrl: string;
        title: string;
        description: string;
        status: number;
        categoryType: string;
        categoryId: string;
        userId: string;
        createdAt: number;
        updatedAt: number;
        isFeatured: boolean;
        addedBy: string;
    }

    export interface GetArticle {
        limit: number;
        page: number;
        sortBy?: string;
        sortType?: number;
        categoryId?: string;
        articleId?: string;
        searchTerm?: string;
        fromDate?: number;
        toDate?: number;
        isFeatured?: boolean;
        status?: string;
        type?: string;

    }
    export interface GetArticleById {
        articleId: string;
    }
    export interface UpdateArticle {
        categoryId: string;
        imageUrl: string;
        title: string;
        description: string;
        articleId: string;
        status?: string;
        isFeatured?: boolean;
    }
    export interface DeleteArticle {
        articleId: string;
    }

    export interface AddCategoriesName {
        name: string;
    }

    export interface CategoryList {
        limit: number;
        page: number;
        sortType?: number;
    }

    export interface CategoryId {
        id?: string;
    }
    export interface CategoryUpdate extends CategoryId {
        name?: string;
        status?: string;
    }
}