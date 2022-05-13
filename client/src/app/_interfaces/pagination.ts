export interface Pagination {
    CurrentPage: number;
    ItemsPerPage: number;
    TotalItems: number;
    TotalPages: number;
}

//Paginating Data for client

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}