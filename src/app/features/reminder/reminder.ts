import { Component, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { ApiService } from '../../shared/service/api/api-service';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CreateReminderRequest, ReminderMoel } from '../../shared/models/reminder.model';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EditReminder } from '../edit-reminder/edit-reminder';

@Component({
  selector: 'app-reminder',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatButton,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatIconButton,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    CurrencyPipe,
    DatePipe,
    MatCardContent,
    MatTooltip,
  ],
  templateUrl: './reminder.html',
  styleUrl: './reminder.scss',
})
export class Reminder implements OnInit {
  reminders = signal<ReminderMoel[]>([]);
  isLoading = signal(false);

  newReminder: CreateReminderRequest = {
    title: '',
    amount: null,
    due_date: '',
    reminder_days_before: 1,
  };

  displayedColumns: string[] = ['status', 'title', 'amount', 'due_date', 'actions'];

  constructor(
    private readonly api: ApiService,
    private readonly notification: NotificationService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadReminders();
  }

  loadReminders() {
    this.isLoading.set(true);
    this.api.getReminders().subscribe({
      next: (res: any) => {
        this.reminders.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onCreate() {
    this.isLoading.set(true);
    if (!this.newReminder.title || !this.newReminder.due_date || !this.newReminder.amount) {
      this.notification.show('warn', 'Please enter required fields');
      this.isLoading.set(false);
      return;
    }

    if (new Date(this.newReminder.due_date) < new Date()) {
      this.notification.show('error', 'Due date cannot be in the past.');
      return;
    }

    this.api.createReminder(this.newReminder).subscribe({
      next: () => {
        this.notification.show('success', 'Reminder scheduled!');
        this.loadReminders();
        this.resetForm();
        this.isLoading.set(false);
      },
      error: () => {
        this.notification.show('error', 'Something went wrong!');
        this.isLoading.set(false);
      },
    });
  }

  onComplete(id: number) {
    this.isLoading.set(true);
    this.api.updateReminderAction(id, { is_completed: true }).subscribe({
      next: () => {
        this.notification.show('success', 'Bill marked as paid!');
        this.loadReminders();
        this.isLoading.set(false);
      },
      error: () => {
        this.notification.show('error', 'Something went wrong!');
        this.isLoading.set(false);
      },
    });
  }

  onDelete(id: number) {
    this.isLoading.set(true);
    if (confirm('Delete this reminder?')) {
      this.api.deleteReminder(id).subscribe({
        next: () => {
          this.loadReminders();
          this.isLoading.set(false);
          this.notification.show('success', 'Reminder removed!');
        },
        error: () => {
          this.notification.show('error', 'Something went wrong!');
          this.isLoading.set(false);
        },
      });
    }
  }

  private resetForm() {
    this.newReminder = { title: '', amount: null, due_date: '', reminder_days_before: 1 };
  }

  isUrgent(dueDate: string): boolean {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3; // Urgent if due within 3 days
  }

  // Mark as Read (Patch Action)
  onMarkRead(id: number) {
    this.isLoading.set(true);
    this.api.updateReminderAction(id, { is_read: true }).subscribe({
      next: () => {
        this.loadReminders();
        this.isLoading.set(false);
        this.notification.show('success', 'Reminder marked as read!');
      },
      error: () => {
        this.notification.show('error', 'Something went wrong!');
        this.isLoading.set(false);
      },
    });
  }

  onEdit(reminder: ReminderMoel) {
    // We create a shallow copy to avoid changing the table data before the API succeeds
    const dialogRef = this.dialog.open(EditReminder, {
      width: '450px',
      data: { ...reminder }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateReminder(result);
      }
    });
  }

  updateReminder(updatedData: ReminderMoel) {
    this.isLoading.set(true);
    if (!updatedData.title || !updatedData.due_date || !updatedData.amount) {
      this.notification.show('warn', 'Please enter required fields');
      this.isLoading.set(false);
      return;
    }

    if (new Date(updatedData.due_date) < new Date()) {
      this.notification.show('error', 'Due date cannot be in the past.');
      return;
    }
    this.api.updateReminder(updatedData.id, updatedData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.notification.show('success', 'Reminder updated successfully');
        this.loadReminders();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.notification.show('success', 'Something went wrong!');
      },
    });
  }
}
