import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateTransactionRequest, Transaction } from '../../shared/models/transaction.model';
import { Category } from '../../shared/models/category.model';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';

import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
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
import { MatDialog } from '@angular/material/dialog';
import { TransactionEdit } from '../transaction-edit/transaction-edit';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCard,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatRowDef,
    MatHeaderRowDef,
    MatInput,
    MatButton,
  ],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  selectedCategory = signal<number | string>('all');
  selectedType = signal<string>('all');

  newTransaction: CreateTransactionRequest = {
    amount: null,
    category_id: null,
    type: 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0], // Defaults to today
  };

  constructor(
    private readonly api: ApiService,
    private readonly notification: NotificationService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

  displayedColumns: string[] = ['date', 'category', 'description', 'type', 'amount', 'actions'];
  filteredTransactions = computed(() => {
    return this.transactions().filter((t) => {
      const categoryMatch =
        this.selectedCategory() === 'all' || t.category_id === this.selectedCategory();
      const typeMatch = this.selectedType() === 'all' || t.type === this.selectedType();
      return categoryMatch && typeMatch;
    });
  });

  loadInitialData() {
    this.isLoading.set(true);
    this.api.getCategories().subscribe((cats: any) => this.categories.set(cats));
    this.loadTransactions();
  }

  loadTransactions() {
    this.api.getTransactions().subscribe({
      next: (data: any) => {
        this.transactions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notification.show('error', 'Failed to load transactions');
        this.isLoading.set(false);
      },
    });
  }

  onCreate() {
    if (
      !this.newTransaction.amount ||
      !this.newTransaction.category_id ||
      !this.newTransaction.date ||
      !this.newTransaction.description
    ) {
      this.notification.show('warn', 'Please fill in all required fields');
      return;
    }

    this.api.createTransaction(this.newTransaction).subscribe({
      next: () => {
        this.notification.show('success', 'Transaction recorded!');
        this.loadTransactions();
        this.resetForm();
      },
      error: (err: any) => {
        const msg = err.error?.error || 'Something went wrong';
        this.notification.show('error', msg);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.api.deleteTransaction(id).subscribe({
        next: () => {
          this.notification.show('success', 'Transaction deleted');
          this.loadTransactions();
        },
        error: () => this.notification.show('error', 'Could not delete transaction'),
      });
    }
  }

  private resetForm() {
    this.newTransaction = {
      amount: null,
      category_id: null,
      type: 'expense',
      description: '',
      date: new Date().toISOString().split('T')[0],
    };
  }
  onEdit(transaction: Transaction) {
    const dialogRef = this.dialog.open(TransactionEdit, {
      width: '400px',
      data: {
        transaction: transaction,
        categories: this.categories(),
      },
    });

    dialogRef.afterClosed().subscribe((result: Transaction) => {
      if (result) {
        if (!result.amount || !result.category_id || !result.date || !result.description) {
          this.notification.show('warn', 'Please fill in all required fields');
          return;
        }
        this.api.updateTransaction(result).subscribe({
          next: () => {
            this.notification.show('success', 'Transaction updated successfully');
            this.loadTransactions();
          },
          error: (err) => {
            this.notification.show('error', err.error?.error || 'Update failed');
          },
        });
      }
    });
  }
}
