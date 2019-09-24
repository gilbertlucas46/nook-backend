export namespace ArticleRequest {

    export interface CreateArticle {
        uploadBy: {
            name: string;
            userId: string;
            type: string;
        };
        category: string;
        userId: string;
        description: string;
        viewCount?: string;
        shareCount?: string;
        articleAction?: object[];
    }
}