export interface Transaction {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category_id: number;
  category_name?: string;
  description: string;
  date: string;
}

export interface CreateTransactionRequest {
  amount: number | null;
  category_id: number | null;
  type: string;
  description: string;
  date: string;
}
