import { Component, computed, OnInit, signal } from '@angular/core';
import { Category, CreateCategoryRequest } from '../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../shared/service/api/api-service';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { ApiResponse } from '../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

// Categories component - manage expense and income categories
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCard,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);

  newCategory: CreateCategoryRequest = {
    name: '',
    type: '',
  };

  // Compute separate lists for expense and income categories
  expenseCategories = computed(() => this.categories().filter((c) => c.type === 'expense'));
  incomeCategories = computed(() => this.categories().filter((c) => c.type === 'income'));

  constructor(
    private readonly api: ApiService,
    private readonly notification: NotificationService,
  ) {}

  // Load all categories when component initializes
  ngOnInit() {
    this.loadCategories();
  }

  // Fetch all categories from API
  loadCategories() {
    this.isLoading.set(true);
    this.api.getCategories().subscribe({
      next: (res: ApiResponse) => {
        this.categories.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        const serverMessage = 'Something went wrong';
        this.notification.show('error', serverMessage);
        this.isLoading.set(false);
      },
    });
  }

  // Create new category - validate name and type are filled
  onCreate() {
    if (this.newCategory.name === '' || this.newCategory.type === '') {
      this.notification.show('warn', 'Please enter category name and type');
      return;
    }
    this.api.createCategory(this.newCategory).subscribe({
      next: (res: ApiResponse) => {
        this.notification.show('success', res.message || 'Category created successfully!');
        this.loadCategories();
        this.newCategory.name = '';
        this.newCategory.type = '';
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'An unexpected error occurred';
        this.notification.show('error', msg);
        this.isLoading.set(false);
      },
    });
  }

  // Delete category after user confirmation
  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.notification.show('success', 'Category deleted successfully!');
          this.loadCategories();
        },
        error: (err: HttpErrorResponse) => {
          const msg = err.error?.message || 'An unexpected error occurred';
          this.notification.show('error', msg);
          this.loadCategories();
        },
      });
    }
  }
}
