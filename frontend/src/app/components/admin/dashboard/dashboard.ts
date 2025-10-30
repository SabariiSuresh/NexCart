import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin/admin-service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalRevenue = 0;
  paidOrders = 0;
  totalUsers = 0;
  totalProducts = 0;
  averageOrderValue = 0;

  allOrders: any[] = [];
  revenue: any[] = [];
  lowStockAlert: any[] = [];
  topProducts: any[] = [];

  revenueChartData: any;
  revenueChartOptions: any;

  ordersChartData: any;
  ordersChartOptions: any;

  topProductsChartData: any;
  topProductsChartOptions: any;

  lowStockChartData: any;
  lowStockChartOptions: any;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (res: any) => {

        this.totalRevenue = res.totalRevenue || 0;
        this.paidOrders = res.paidOrders || 0;
        this.totalUsers = res.totalUsers || 0;
        this.allOrders = res.allOrder || 0;
        this.totalProducts = res.totalProducts || 0;
        this.averageOrderValue = this.paidOrders ? this.totalRevenue / this.paidOrders : 0;

        const revenueLabels = res.revenueLastWeek?.map((d: any) => d._id) || [];
        const revenueData = res.revenueLastWeek?.map((d: any) => d.total) || [];
        this.revenueChartData = {
          labels: revenueLabels,
          datasets: [
            {
              label: 'Revenue (INR)',
              data: revenueData,
              backgroundColor: '#22c55e'
            }
          ]
        };
        this.revenueChartOptions = {
          plugins: { legend: { labels: { color: 'black' } } },
          scales: {
            x: { ticks: { color: 'black' }, grid: { color: 'lightgray' } },
            y: { ticks: { color: 'black' }, grid: { color: 'lightgray' } }
          }
        };

        const orderLabels = res.revenueLastWeek?.map((d: any) => d._id) || [];
        const orderData = res.revenueLastWeek?.map((d: any) => d.orders || 0) || [];
        this.ordersChartData = {
          labels: orderLabels,
          datasets: [
            {
              label: 'Orders',
              data: orderData,
              fill: false,
              borderColor: '#3b82f6',
              tension: 0.4
            }
          ]
        };
        this.ordersChartOptions = {
          plugins: { legend: { labels: { color: 'black' } } },
          scales: {
            x: { ticks: { color: 'black' }, grid: { color: 'lightgray' } },
            y: { ticks: { color: 'black' }, grid: { color: 'lightgray' } }
          }
        };

        const topProductsLabels = res.topProducts?.map((p: any) => p.name) || [];
        const topProductsData = res.topProducts?.map((p: any) => p.totalSold) || [];
        const topProductsColors = ['#facc15', '#f97316', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#e11d48'];
        this.topProductsChartData = {
          labels: topProductsLabels,
          datasets: [{ data: topProductsData, backgroundColor: topProductsColors }]
        };
        this.topProductsChartOptions = {
          plugins: { legend: { labels: { color: 'black' } } },
          scales: {
            r: {
              ticks: { color: 'black' },
              grid: { color: 'lightgray' },
              angleLines: { color: 'lightgray' },
              pointLabels: { color: 'black' }
            }
          }
        };

        const lowStockLabels = res.lowStockAlert?.map((p: any) => p.name) || [];
        const lowStockData = res.lowStockAlert?.map((p: any) => p.stock) || [];
        this.lowStockChartData = {
          labels: lowStockLabels,
          datasets: [{ label: 'Stock Remaining', data: lowStockData, backgroundColor: '#ef4444' }]
        };
        this.lowStockChartOptions = {
          indexAxis: 'y',
          plugins: { legend: { labels: { color: 'black' } } },
          scales: {
            x: { ticks: { color: 'black' }, grid: { color: 'lightgray' } },
            y: { ticks: { color: 'black' }, grid: { color: 'lightgray' } }
          }
        };

      },
      error: (err) => {
        console.error('Dashboard load error:', err);
      }
    });
  }



}
