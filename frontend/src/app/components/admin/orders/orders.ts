import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order/order-service';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {

  orders: any[] = [];
  statuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];


  constructor(private orderService: OrderService, private notify: NotificationService, private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {

    this.orderService.getAllOrder().subscribe({

      next: (res) => {
        this.orders = res.order || res.orders;
      }, error: err => {
        console.error(err);
      }
    })
  }


  updateStatus(id: string, status: string) {

    this.orderService.updateStatus(id, status).subscribe({

      next: () => {
        this.notify.success('Status updated');
        this.loadOrders();
      }, error: err => {
        this.notify.error('Failed to update status');
        console.error(err);
      }
    })
  }


  updateDeliverystatus(id: string, status: string) {
    this.orderService.updateOrderDeliverd(id, status).subscribe({
      next: () => {
        this.notify.success('Delivery status updated');
        this.loadOrders();
      }, error: err => {
        this.notify.error('Failed to update delivery status');
        console.error(err);
      }
    })
  }



  cancelOrder(event : Event ,id: string) {

    this.confirmService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to cancel this order?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },

      accept: () => {

        this.orderService.cancellOrder(id).subscribe({
          next: () => {
            this.notify.success('Order cancelled');
            this.loadOrders();
          }, error: err => {
            this.notify.error('Failed to cancell order');
            console.error(err);
          }
        });
      }
    });
  }


  deleteOrder(event :Event , id: string) {

    this.confirmService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to delete this order?',
      icon: 'pi pi-info-circle',
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

        this.orderService.deleteOrder(id).subscribe({
          next: () => {
            this.notify.success('Order deleted');
            this.loadOrders();
          }, error: err => {
            this.notify.error('Failed to deleted order');
            console.error(err);
          }
        });
      }
    });
  }



}
