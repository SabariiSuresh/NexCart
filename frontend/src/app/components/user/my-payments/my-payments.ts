import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../services/payment/payment-service';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-my-payments',
  standalone: false,
  templateUrl: './my-payments.html',
  styleUrl: './my-payments.css'
})
export class MyPayments implements OnInit{

  payments : any[] = [];


  constructor(private paymentService : PaymentService , private notify : NotificationService){}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(){
    this.paymentService.getMyPayments().subscribe({
      next : (res)=> {
        this.payments = res.userPayments;
      } , 
      error : (err)=>{
        this.notify.error('Failed to get payments');
        console.error('Payment error' , err);
      }
    })
  }

}
