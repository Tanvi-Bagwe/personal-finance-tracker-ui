import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { CategoriesComponent } from './categories';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { ApiResponse } from '../../shared/models/api-response';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let apiService: {
    getCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
    deleteCategory: ReturnType<typeof vi.fn>;
  };
  let notificationService: {
    show: ReturnType<typeof vi.fn>;
  };

  const mockCategories = [
    { id: 1, name: 'Groceries', type: 'expense' },
    { id: 2, name: 'Salary', type: 'income' },
  ];

  beforeEach(async () => {
    const apiServiceMock = {
      getCategories: vi.fn(),
      createCategory: vi.fn(),
      deleteCategory: vi.fn(),
    };

    const notificationServiceMock = {
      show: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as any;
    notificationService = TestBed.inject(NotificationService) as any;

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit() should call loadCategories', () => {
    apiService.getCategories.mockReturnValue(of({ data: mockCategories } as ApiResponse));
    vi.spyOn(component, 'loadCategories');

    component.ngOnInit();

    expect(component.loadCategories).toHaveBeenCalled();
  });

  it('loadCategories() should load categories from API', () => {
    apiService.getCategories.mockReturnValue(of({ data: mockCategories } as ApiResponse));

    component.loadCategories();

    expect(component.categories()).toEqual(mockCategories);
    expect(component.isLoading()).toBe(false);
  });

  it('onDelete() should delete category when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    apiService.deleteCategory.mockReturnValue(of({}));
    apiService.getCategories.mockReturnValue(of({ data: mockCategories } as ApiResponse));

    component.onDelete(1);

    expect(apiService.deleteCategory).toHaveBeenCalledWith(1);
    expect(notificationService.show).toHaveBeenCalledWith(
      'success',
      'Category deleted successfully!',
    );
  });

  it('expenseCategories computed should filter expense categories', () => {
    component.categories.set(mockCategories);

    const expenseCategories = component.expenseCategories();

    expect(expenseCategories.length).toBe(1);
    expect(expenseCategories[0].type).toBe('expense');
  });

  it('incomeCategories computed should filter income categories', () => {
    component.categories.set(mockCategories);

    const incomeCategories = component.incomeCategories();

    expect(incomeCategories.length).toBe(1);
    expect(incomeCategories[0].type).toBe('income');
  });
});
