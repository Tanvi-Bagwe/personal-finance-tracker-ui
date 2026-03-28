import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/service/api/api-service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { LoaderService } from '../../shared/service/loader-service/loader-service';
import { ApiResponse } from '../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

export interface DashboardData {
  summary: {
    income: number;
    expense: number;
    balance: number;
  };
  category_distribution: Array<{
    category__name: string;
    value: number;
  }>;
  trends: Array<{
    month: string;
    type: 'income' | 'expense';
    total: number;
  }>;
  reminders: {
    pending: number;
    overdue: number;
  };
}

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, NgApexchartsModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome implements OnInit {
  summary = signal<any>({ income: 0, expense: 0, balance: 0 });

  barChartOptions = signal<any>(null);
  donutChartOptions = signal<any>(null);
  radialChartOptions = signal<any>(null);
  lineChartOptions = signal<any>(null);

  constructor(
    private readonly api: ApiService,
    private readonly notificationService: NotificationService,
    private readonly loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.loaderService.show();
    this.api.getDashboardSummary().subscribe({
      next: (res: ApiResponse) => {
        const data = res.data as DashboardData;
        if (!data) return;

        this.summary.set(data.summary);

        if (data.trends) {
          this.initBarChart(data.trends);
          this.initGradientAreaChart(data.trends);
        }

        if (data.category_distribution) {
          this.initDonutChart(data.category_distribution);
        }

        if (data.reminders) {
          this.initRadialChart(data.reminders);
        }
        this.loaderService.hide();
        this.notificationService.show(
          'success',
          res.message || 'Dashboard initialized successfully!',
        );
      },
      error: (err: HttpErrorResponse) => {
        this.notificationService.show('error', 'Something went wrong');
        this.loaderService.hide();
      },
    });
  }

  private initBarChart(trends: any[]) {
    const categories = [
      ...new Set(
        trends.map((d) =>
          d.month ? new Date(d.month).toLocaleDateString('default', { month: 'short' }) : '',
        ),
      ),
    ];

    const incomeData = trends.filter((d) => d.type === 'income').map((d) => d.total);
    const expenseData = trends.filter((d) => d.type === 'expense').map((d) => d.total);

    this.barChartOptions.set({
      series: [
        { name: 'Income', data: incomeData },
        { name: 'Expense', data: expenseData },
      ],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      colors: ['#4caf50', '#f44336'],
      plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
      dataLabels: { enabled: false },
      xaxis: { categories: categories },
      yaxis: { title: { text: 'Amount (€)' } },
      legend: { position: 'top' },
    });
  }

  private initDonutChart(dist: any[]) {
    this.donutChartOptions.set({
      series: dist.map((d) => parseFloat(d.value)),
      labels: dist.map((d) => d.category__name),
      chart: { type: 'donut', height: 350 },
      colors: ['#3f51b5', '#00bcd4', '#e91e63', '#ff9800', '#9c27b0'],
      legend: { position: 'bottom' },
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 200 }, legend: { position: 'bottom' } },
        },
      ],
    });
  }

  private initRadialChart(reminders: any) {
    const total = reminders.pending || 1;
    const overdue = reminders.overdue || 0;
    const overduePercent = Math.round((overdue / total) * 100);

    this.radialChartOptions.set({
      series: [overduePercent],
      chart: { height: 300, type: 'radialBar' },
      plotOptions: {
        radialBar: {
          hollow: { size: '70%' },
          dataLabels: {
            name: { show: true, fontSize: '16px' },
            value: { fontSize: '22px', show: true, formatter: (val: any) => val + '%' },
          },
        },
      },
      labels: ['Overdue Risk'],
      colors: ['#ff5722'],
    });
  }

  private initGradientAreaChart(trends: any[]) {
    const categories = trends
      .filter((d) => d.type === 'income')
      .map((d) => new Date(d.month).toLocaleDateString('default', { month: 'short' }));
    const data = trends.filter((d) => d.type === 'income').map((d) => d.total);

    this.lineChartOptions.set({
      series: [{ name: 'Revenue', data: data }],
      chart: { type: 'area', height: 300, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      xaxis: { categories: categories },
      colors: ['#3f51b5'],
    });
  }
}
