export interface ReminderMoel {
  id: number;
  title: string;
  amount: number | null;
  due_date: string;
  reminder_days_before: number;
  is_read: boolean;
  is_completed: boolean;
}

export interface CreateReminderRequest {
  title: string;
  amount: number | null;
  due_date: string;
  reminder_days_before: number;
}
