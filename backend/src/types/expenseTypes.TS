export interface ExpenseInput {
  title: string;
  amount: number;
  category: string;
  date?: Date;
  note?: string;
}

export interface ExpenseResponse {
  _id: string;
  title: string;
  amount: number;
  category: {
    _id: string;
    name: string;
    color: string;
  };
  user: string;
  date: Date;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  color?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  color: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SummaryResponse {
  success: boolean;
  totalSpent: number;
  data: {
    _id: string;
    total: number;
    count: number;
    category: { _id: string; name: string; color: string; };
  }[];
}s