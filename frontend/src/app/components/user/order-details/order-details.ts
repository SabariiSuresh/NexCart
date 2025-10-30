import { Component } from '@angular/core';
import { OrderService } from '../../../services/order/order-service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification/notification-service';

interface Step {
  label: string;
  description: string;
}

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails {

  order: any;
  steps: Step[] = [];
  orderStatus = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService, private route: ActivatedRoute, private notify: NotificationService) { }

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id')

    this.steps = this.orderStatus.map(status => ({
      label: status,
      description: this.getStepMessage(status)
    }));

    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: (res) => {
          this.order = res.order || res.orders;
        },
        error: (err) => {
          this.notify.error('Faield to fetch order deatils');
          console.error('Failed to fetch order details', err)
        }
      })
    }

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


  getActiveStep(orderStatus: string): number {
    const index = this.orderStatus.indexOf(orderStatus);
    return index >= 0 ? index : 0;
  }

}
