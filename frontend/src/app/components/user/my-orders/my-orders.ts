import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order/order-service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification-service';

interface Step {
  label: string;
  description: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {

  orders: any[] = [];
  paginatedOrders: any[] = [];
  rows: number = 4;
  first: number = 0;

  steps: Step[] = [];

  orderStatus = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  selectedStatus : string = 'All'
  filteredOrders: any[] = [];

  constructor(private orderService: OrderService, private router: Router, private notify: NotificationService) { }

  ngOnInit(): void {

    this.steps = this.orderStatus.map(status => ({
      label: status,
      description: this.getStepMessage(status)
    }));

    this.loadOrders();

  }


  loadOrders() {
    this.orderService.getMyOrder().subscribe({

      next: (res) => {
        this.orders = res.order;
        this.filteredOrders = this.orders;
        this.updatePaginatedOrders();
      },
      error: (err) => {
        this.notify.error('Failed to fetch orders');
        console.error('Failed to fetch orders', err);
      }
    })
  }


  getStepMessage(status: string): string {
    switch (status) {
      case 'Pending': return 'We are processing your order.';
      case 'Shipped': return 'It is on the way to your delivery address.';
      case 'Delivered': return 'We hope you enjoy your purchase!';
      case 'Cancelled': return 'You cancelled this order.';
      default: return '';
    }
  }


  getIcon(label: string): string {
    switch (label) {
      case 'Pending': return 'pi pi-clock';
      case 'Shipped': return 'pi pi-truck';
      case 'Delivered': return 'pi pi-check-circle';
      case 'Cancelled': return 'pi pi-times-circle';
      default: return '';
    }
  }

  filteredOrder(status: string) {
    this.selectedStatus = status;

    if (status === 'All') {
      this.filteredOrders = this.orders;
    } else {
      const statusMap: any = {
        'On the way': 'Shipped',
        'Delivered': 'Delivered',
        'Cancelled': 'Cancelled'
      };

      const actualStatus = statusMap[status] || status;
      this.filteredOrders = this.orders.filter(order => order.status === actualStatus);
    }

    this.first = 0;
    this.updatePaginatedOrders();
  }



  getActiveStep(orderStatus: string): number {
    const index = this.orderStatus.indexOf(orderStatus);
    return index >= 0 ? index : 0;
  }


  updatePaginatedOrders() {
    this.paginatedOrders = this.filteredOrders.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePaginatedOrders();
  }

  trackOrder(id: string) {
    this.router.navigate([`/user/order-confirmation/${id}`]);
  }

}
