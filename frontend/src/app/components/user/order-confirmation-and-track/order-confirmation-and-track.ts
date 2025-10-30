import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order/order-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

interface Step {
  label: string;
  description: string;
}

@Component({
  selector: 'app-order-confirmation-and-track',
  standalone: false,
  templateUrl: './order-confirmation-and-track.html',
  styleUrl: './order-confirmation-and-track.css'
})
export class OrderConfirmationAndTrack implements OnInit {

  orderId!: string;
  order!: any;
  orderStatus = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  isDiscountApplied: boolean = false;
  steps: Step[] = [];

  activeStep: number = 0;


  constructor(private orderService: OrderService, private route: ActivatedRoute, private confirm: ConfirmationService, private notify: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }
    this.fetchOrder();
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



  fetchOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: res => {
        this.order = res.order || res;

        this.isDiscountApplied = !!this.order.isDiscountApplied;

        this.steps = this.orderStatus.map(status => ({
          label: status,
          description: this.getStepMessage(status)
        }));

        const index = this.orderStatus.indexOf(this.order?.status);
        this.activeStep = index >= 0 ? index : 0;

      },
      error: err => {
        console.error('Failed to fetch order', err);
        this.notify.error('Failed to get order');
      }
    });
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



  cancelOrder(event: Event) {
    this.confirm.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure you want to cancel this order?',
      icon: 'pi pi-info-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.orderService.cancellOrder(this.orderId).subscribe({
          next: () => {
            this.notify.success('Order cancelled');
            this.fetchOrder();
          }, error: err => {
            this.notify.error('Failed to cancell order');
            console.error(err);
          }
        });
      }
    })
  }

  goToShop() {
    this.router.navigate(['/home']);
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }

}
