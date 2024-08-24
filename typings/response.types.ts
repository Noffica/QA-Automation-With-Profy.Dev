export type Meta = {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type Page<T> = {
  items: T[];
  meta: PageMeta;
};
