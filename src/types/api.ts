export type PaginatedResponse<TData> = {
  data: TData[];
  links: Record<string, string | null>;
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type ApiPerson = {
  id: number;
  name: string;
  age: number;
  location: string;
  pictures: string[];
  likes_count?: number;
  dislikes_count?: number;
};

