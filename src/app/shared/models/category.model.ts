export interface Category {
  id: number;
  name: string;
  type: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: string;
}
