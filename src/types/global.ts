export type ApiResponse<T> = {
  data: T;
  message: string;
  status: string;
  code: string;
};

export type ApiPagination = {
  prevPage: number | null;
  nextPage: number | null;
  perPage: number;
  offset: number;
  total: number;
  currentPage: number;
  totalPages: number;
};

export type PaginatedApiResponse<T> = ApiResponse<T> & {
  pagination: ApiPagination;
};
