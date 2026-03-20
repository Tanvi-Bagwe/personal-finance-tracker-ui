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

  expenseCategories = computed(() => this.categories().filter((c) => c.type === 'expense'));
  incomeCategories = computed(() => this.categories().filter((c) => c.type === 'income'));

  constructor(
    private readonly api: ApiService,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading.set(true);
    this.api.getCategories().subscribe({
      next: (data: any) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        const serverMessage = 'Something went wrong';
        this.notification.show('error', serverMessage);
        this.isLoading.set(false);
      },
    });
  }

  onCreate() {
    if (this.newCategory.name === '' || this.newCategory.type === '') {
      this.notification.show('warn', 'Please enter category name and type');
      return;
    }
    this.api.createCategory(this.newCategory).subscribe({
      next: (res) => {
        this.notification.show('success', 'Category created successfully!');
        this.loadCategories();
        this.newCategory.name = '';
        this.newCategory.type = '';
      },
      error: (err: any) => {
        const serverMessage = err.error?.error || 'Something went wrong';
        this.notification.show('error', serverMessage);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.api.deleteCategory(id).subscribe({
        next: () => {
          this.notification.show('success', 'Category deleted successfully!');
          this.loadCategories();
        },
        error: (err: any) => {
          const serverMessage = 'Something went wrong';
          this.notification.show('error', serverMessage);
          this.loadCategories();
        },
      });
    }
  }
}
