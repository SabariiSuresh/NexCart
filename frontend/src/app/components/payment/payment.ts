import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment/payment-service';
import { DynamicDialogConfig, DynamicDialogRef, } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentDialog {

  paymentForm: FormGroup;
  paymentMethods = ['COD', 'Upi', 'Card', 'Netbanking'];
  processing = false;
  paymentStatus: 'success' | 'failed' | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    const data = config.data;
    this.paymentForm = this.fb.group({
      method: [data?.method || 'COD', Validators.required],
      upiId: ['', [Validators.pattern("^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$")]],
      cardNumber: ['', [Validators.pattern("^[0-9]{12}$")]],
      cardName: [''],
      expiry: [''],
      cvv: ['', [Validators.pattern("^[0-9]{3,4}$")]],
      bankName: [''],
      transactionId: ['', [Validators.pattern("^[a-zA-Z0-9]{6,20}$")]]
    });

    this.onPaymentChange();
  }


  cancelPayment() {
    this.ref.close(false);
  }


  onPaymentChange() {
    const payment = this.paymentForm.value.method;

    ['upiId', 'cardNumber', 'cardName', 'expiry', 'cvv', 'bankName', 'transactionId'].forEach(f => {
      this.paymentForm.get(f)?.clearValidators();
      this.paymentForm.get(f)?.updateValueAndValidity();
    });

    if (payment === 'Upi') {
      this.paymentForm.get('upiId')?.setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$")]);
    } else if (payment === 'Card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern("^[0-9]{12}$")]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required]);
      this.paymentForm.get('expiry')?.setValidators([Validators.required]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern("^[0-9]{3,4}$")]);
    } else if (payment === 'Netbanking') {
      this.paymentForm.get('bankName')?.setValidators([Validators.required]);
      this.paymentForm.get('transactionId')?.setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9]{6,20}$")]);
    }

    ['upiId', 'cardNumber', 'cardName', 'expiry', 'cvv', 'bankName', 'transactionId'].forEach(f => {
      this.paymentForm.get(f)?.updateValueAndValidity();
    });
  }

  confirmPayment() {
    if (this.paymentForm.invalid) return;

    this.processing = true;
    this.paymentStatus = null;

    const paymentData = {
      orderId: this.config.data.orderId,
      method: this.paymentForm.value.method,
      paymentDetails: this.paymentForm.value
    };

    this.paymentService.createPayment(paymentData).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.paymentStatus = 'success';
        setTimeout(() => {
          this.ref.close(res.payment);
        }, 1000);
      },
      error: (err) => {
        this.processing = false;
        this.paymentStatus = 'failed';
        this.ref.close(false);
        console.error('failed payment', err);
      }
    });
  }

}
