import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateTransactionRequest, Transaction } from '../../shared/models/transaction.model';
import { Category } from '../../shared/models/category.model';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';

import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
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
import { ApiResponse } from '../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTooltip } from '@angular/material/tooltip';

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
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    ReactiveFormsModule,
    MatError,
    MatTooltip,
  ],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.scss'],
})
export class TransactionsComponent implements OnInit {
  transactionCreateForm: FormGroup;

  transactions = signal<Transaction[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  selectedCategory = signal<number | string>('all');
  selectedType = signal<string>('all');

  constructor(
    private readonly api: ApiService,
    private readonly notification: NotificationService,
    private readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
  ) {
    this.transactionCreateForm = this.fb.group({
      amount: [Validators.required, Validators.min(1)],
      date: [new Date().toISOString().split('T')[0], [Validators.required]],
      category_id: ['', Validators.required],
      transactionType: ['', Validators.required],
      description: [''],
    });
  }

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
    this.api.getCategories().subscribe({
      next: (res: ApiResponse) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.isLoading.set(false);
      },
    });
    this.loadTransactions();
  }

  loadTransactions() {
    this.api.getTransactions().subscribe({
      next: (res: ApiResponse) => {
        this.transactions.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notification.show('error', 'Failed to load transactions');
        this.isLoading.set(false);
      },
    });
  }

  onCreate() {
    if (this.transactionCreateForm.invalid) {
      this.notification.show('warn', 'Please fill in all required fields');
      return;
    }

    const newTransaction: CreateTransactionRequest = {
      amount: this.transactionCreateForm.value.amount,
      category_id: this.transactionCreateForm.value.category_id,
      type: this.transactionCreateForm.value.transactionType,
      description: this.transactionCreateForm.value.description,
      date: this.transactionCreateForm.value.date, // Defaults to today
    };

    this.api.createTransaction(newTransaction).subscribe({
      next: (res: ApiResponse) => {
        this.notification.show('success', res.message || 'Transaction successfully recorder');
        this.loadTransactions();
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
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
    this.transactionCreateForm.reset();
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
        if (
          !result.amount ||
          result.amount < 0 ||
          !result.category_id ||
          !result.date ||
          !result.description
        ) {
          this.notification.show('warn', 'Please fill in all required fields');
          return;
        }
        this.api.updateTransaction(result).subscribe({
          next: (res: ApiResponse) => {
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
