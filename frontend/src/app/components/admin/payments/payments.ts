import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment/payment-service';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  payments: any[] = [];
  statusOptions = ["Success", "Pending", "Failed", "Paid"];

  constructor(private paymentService: PaymentService, private notify: NotificationService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadPayments();
  }


  loadPayments() {

    this.paymentService.getAllPayments().subscribe({

      next: (res) => {
        this.payments = res.payments || res;
        console.log('Load payments', res)
      }, error: (err) => {
        console.error(err);
      }
    });

  }


  updateStatus(id: string, status: string) {

    this.paymentService.updatePaymentStatus(id, status).subscribe({

      next: () => {

        this.notify.success('Payment status update');
        this.loadPayments();
      }, error: err => {
        this.notify.error('Failed to update payment status');
        console.error(err);
      }
    })
  }


  deletePayment(event : Event , id: string) {

    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to delete this record?',
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
        this.paymentService.deletePayment(id).subscribe({
          next: () => {
            this.notify.success('Payment deleted');
            this.loadPayments();
          }, error: err => {
            this.notify.error('Failed to delete payment');
            console.error(err);
          }
        });
      }
    })
  }

}
