export interface ApiResponse<T> {
  data: T
}

export interface ApiResponseWithMeta<T, E> {
  data: T
  meta: E
}

export interface PaginationMeta {
  page: number
  size: number
  total: number
}
