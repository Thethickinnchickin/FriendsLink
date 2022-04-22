export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

//Paginating Data for client

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}