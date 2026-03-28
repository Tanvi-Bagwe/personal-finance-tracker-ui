import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { TransactionsComponent } from './transactions';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { Transaction, CreateTransactionRequest } from '../../shared/models/transaction.model';
import { Category } from '../../shared/models/category.model';
import { ApiResponse } from '../../shared/models/api-response';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let apiService: {
    getCategories: ReturnType<typeof vi.fn>;
    getTransactions: ReturnType<typeof vi.fn>;
    createTransaction: ReturnType<typeof vi.fn>;
    updateTransaction: ReturnType<typeof vi.fn>;
    deleteTransaction: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    show: ReturnType<typeof vi.fn>;
  };
  let matDialog: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCategories: Category[] = [
    { id: 1, name: 'Groceries', type: 'expense' },
    { id: 2, name: 'Salary', type: 'income' },
    { id: 3, name: 'Utilities', type: 'expense' },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      amount: 50,
      type: 'expense',
      category_id: 1,
      category_name: 'Groceries',
      description: 'Weekly groceries',
      date: '2026-03-25',
    },
    {
      id: 2,
      amount: 2000,
      type: 'income',
      category_id: 2,
      category_name: 'Salary',
      description: 'Monthly salary',
      date: '2026-03-01',
    },
    {
      id: 3,
      amount: 100,
      type: 'expense',
      category_id: 3,
      category_name: 'Utilities',
      description: 'Electric bill',
      date: '2026-03-20',
    },
  ];

  beforeEach(async () => {
    const apiServiceMock = {
      getCategories: vi.fn(),
      getTransactions: vi.fn(),
      createTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    };

    const notificationServiceMock = {
      show: vi.fn(),
    };

    const matDialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [TransactionsComponent, ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        FormBuilder,
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    matDialog = TestBed.inject(MatDialog) as any;

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize signals with empty/default values', () => {
      expect(component.transactions()).toEqual([]);
      expect(component.categories()).toEqual([]);
      expect(component.isLoading()).toBe(false);
      expect(component.selectedCategory()).toBe('all');
      expect(component.selectedType()).toBe('all');
    });
  });

  describe('ngOnInit - loadInitialData', () => {
    it('should load categories and transactions on init', () => {
      apiService.getCategories.mockReturnValue(of({ data: mockCategories } as ApiResponse));
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.ngOnInit();

      expect(apiService.getCategories).toHaveBeenCalled();
      expect(apiService.getTransactions).toHaveBeenCalled();
      expect(component.categories()).toEqual(mockCategories);
      expect(component.transactions()).toEqual(mockTransactions);
      expect(component.isLoading()).toBe(false);
    });

    it('should show error notification when categories fail to load', () => {
      apiService.getCategories.mockReturnValue(throwError(() => new Error('API Error')));
      apiService.getTransactions.mockReturnValue(of({ data: [] } as ApiResponse));

      component.ngOnInit();

      expect(notificationService.show).toHaveBeenCalledWith('error', 'Failed to load categories');
      expect(component.isLoading()).toBe(false);
    });

    it('should show error notification when transactions fail to load', () => {
      apiService.getCategories.mockReturnValue(of({ data: mockCategories } as ApiResponse));
      apiService.getTransactions.mockReturnValue(throwError(() => new Error('API Error')));

      component.ngOnInit();

      expect(notificationService.show).toHaveBeenCalledWith('error', 'Failed to load transactions');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('loadTransactions', () => {
    it('should load transactions successfully', () => {
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.loadTransactions();

      expect(component.transactions()).toEqual(mockTransactions);
      expect(component.isLoading()).toBe(false);
    });

    it('should handle error when loading transactions', () => {
      apiService.getTransactions.mockReturnValue(throwError(() => new Error('API Error')));

      component.loadTransactions();

      expect(notificationService.show).toHaveBeenCalledWith('error', 'Failed to load transactions');
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('onCreate - Create Transaction', () => {
    beforeEach(() => {
      component.categories.set(mockCategories);
    });

    it('should create a new transaction successfully', () => {
      const mockResponse: ApiResponse = {
        data: null,
        message: 'Transaction successfully recorded',
      };

      component.transactionCreateForm.patchValue({
        amount: 50,
        category_id: 1,
        transactionType: 'expense',
        description: 'Test transaction',
        date: '2026-03-25',
      });

      apiService.createTransaction.mockReturnValue(of(mockResponse));
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.onCreate();

      expect(apiService.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 50,
          category_id: 1,
          type: 'expense',
          description: 'Test transaction',
          date: '2026-03-25',
        }),
      );
      expect(notificationService.show).toHaveBeenCalledWith(
        'success',
        'Transaction successfully recorded',
      );
    });

    it('should show validation error when form is invalid', () => {
      component.transactionCreateForm.patchValue({
        amount: null,
        category_id: '',
      });

      component.onCreate();

      expect(notificationService.show).toHaveBeenCalledWith(
        'warn',
        'Please fill in all required fields',
      );
      expect(apiService.createTransaction).not.toHaveBeenCalled();
    });

    it('should show error notification on API failure', () => {
      component.transactionCreateForm.patchValue({
        amount: 50,
        category_id: 1,
        transactionType: 'expense',
        description: 'Test transaction',
        date: '2026-03-25',
      });

      const errorResponse = { error: { error: 'Invalid transaction' } };
      apiService.createTransaction.mockReturnValue(throwError(() => errorResponse));

      component.onCreate();

      expect(notificationService.show).toHaveBeenCalledWith('error', 'Invalid transaction');
    });

    it('should reset form after successful creation', () => {
      const mockResponse: ApiResponse = { data: null, message: 'Success' };

      component.transactionCreateForm.patchValue({
        amount: 50,
        category_id: 1,
        transactionType: 'expense',
        description: 'Test transaction',
        date: '2026-03-25',
      });

      apiService.createTransaction.mockReturnValue(of(mockResponse));
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.onCreate();

      expect(component.transactionCreateForm.get('amount')?.value).toBeNull();
      expect(component.transactionCreateForm.get('category_id')?.value).toBeNull();
    });
  });

  describe('onDelete - Delete Transaction', () => {
    it('should delete a transaction when user confirms', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      apiService.deleteTransaction.mockReturnValue(of({}));
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.onDelete(1);

      expect(apiService.deleteTransaction).toHaveBeenCalledWith(1);
      expect(notificationService.show).toHaveBeenCalledWith('success', 'Transaction deleted');
    });

    it('should not delete transaction when user cancels', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      component.onDelete(1);

      expect(apiService.deleteTransaction).not.toHaveBeenCalled();
    });

    it('should show error notification on delete failure', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      apiService.deleteTransaction.mockReturnValue(throwError(() => new Error('Delete failed')));

      component.onDelete(1);

      expect(notificationService.show).toHaveBeenCalledWith(
        'error',
        'Could not delete transaction',
      );
    });
  });

  describe('onEdit - Edit Transaction', () => {
    it('should open edit dialog with transaction and categories', () => {
      const mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(null)),
      };
      matDialog.open.mockReturnValue(mockDialogRef);

      const transaction = mockTransactions[0];
      component.categories.set(mockCategories);

      component.onEdit(transaction);

      expect(matDialog.open).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: '400px',
          data: {
            transaction: transaction,
            categories: mockCategories,
          },
        }),
      );
    });

    it('should update transaction after successful dialog close', () => {
      const updatedTransaction = {
        ...mockTransactions[0],
        amount: 100,
        description: 'Updated description',
      };

      const mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(updatedTransaction)),
      };
      matDialog.open.mockReturnValue(mockDialogRef);

      const mockResponse: ApiResponse = { data: null, message: 'Updated' };
      apiService.updateTransaction.mockReturnValue(of(mockResponse));
      apiService.getTransactions.mockReturnValue(of({ data: mockTransactions } as ApiResponse));

      component.categories.set(mockCategories);
      component.onEdit(mockTransactions[0]);

      expect(apiService.updateTransaction).toHaveBeenCalledWith(updatedTransaction);
      expect(notificationService.show).toHaveBeenCalledWith(
        'success',
        'Transaction updated successfully',
      );
    });

    it('should show validation warning for invalid edited transaction', () => {
      const invalidTransaction = {
        ...mockTransactions[0],
        amount: -50,
      };

      const mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(invalidTransaction)),
      };
      matDialog.open.mockReturnValue(mockDialogRef);

      component.categories.set(mockCategories);
      component.onEdit(mockTransactions[0]);

      expect(notificationService.show).toHaveBeenCalledWith(
        'warn',
        'Please fill in all required fields',
      );
      expect(apiService.updateTransaction).not.toHaveBeenCalled();
    });

    it('should show error notification on update failure', () => {
      const mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(mockTransactions[0])),
      };
      matDialog.open.mockReturnValue(mockDialogRef);

      const errorResponse = { error: { error: 'Update failed' } };
      apiService.updateTransaction.mockReturnValue(throwError(() => errorResponse));

      component.categories.set(mockCategories);
      component.onEdit(mockTransactions[0]);

      expect(notificationService.show).toHaveBeenCalledWith('error', 'Update failed');
    });

    it('should not update transaction if dialog is closed without result', () => {
      const mockDialogRef = {
        afterClosed: vi.fn().mockReturnValue(of(null)),
      };
      matDialog.open.mockReturnValue(mockDialogRef);

      component.categories.set(mockCategories);
      component.onEdit(mockTransactions[0]);

      expect(apiService.updateTransaction).not.toHaveBeenCalled();
    });
  });

  describe('filteredTransactions - Computed Signal', () => {
    beforeEach(() => {
      component.transactions.set(mockTransactions);
    });

    it('should return all transactions when no filters are applied', () => {
      component.selectedCategory.set('all');
      component.selectedType.set('all');

      const filtered = component.filteredTransactions();

      expect(filtered.length).toBe(mockTransactions.length);
      expect(filtered).toEqual(mockTransactions);
    });

    it('should filter transactions by category', () => {
      component.selectedCategory.set(1);
      component.selectedType.set('all');

      const filtered = component.filteredTransactions();

      expect(filtered.length).toBe(1);
      expect(filtered[0].category_id).toBe(1);
    });

    it('should filter transactions by type', () => {
      component.selectedCategory.set('all');
      component.selectedType.set('expense');

      const filtered = component.filteredTransactions();

      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => t.type === 'expense')).toBe(true);
    });

    it('should filter transactions by both category and type', () => {
      component.selectedCategory.set(1);
      component.selectedType.set('expense');

      const filtered = component.filteredTransactions();

      expect(filtered.length).toBe(1);
      expect(filtered[0].category_id).toBe(1);
      expect(filtered[0].type).toBe('expense');
    });

    it('should return empty array when no transactions match filters', () => {
      component.selectedCategory.set(999);
      component.selectedType.set('all');

      const filtered = component.filteredTransactions();

      expect(filtered.length).toBe(0);
    });
  });

  describe('displayedColumns', () => {
    it('should have correct columns for the table', () => {
      expect(component.displayedColumns).toEqual([
        'date',
        'category',
        'description',
        'type',
        'amount',
        'actions',
      ]);
    });
  });
});
