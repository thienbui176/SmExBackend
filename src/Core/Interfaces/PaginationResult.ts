export interface PaginationResult<T> {
    list: T[];
    total: number | null;
    page: number;
    limit: number;
}
