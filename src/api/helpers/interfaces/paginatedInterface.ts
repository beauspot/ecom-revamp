export interface Paginated<T> {
    page: Array<T>;
    currentPage: number;
    totalPages: number;
    total: number;
}