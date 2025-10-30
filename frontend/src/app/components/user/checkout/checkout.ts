import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification/notification-service';
import { OrderService } from '../../../services/order/order-service';
import { DialogService } from 'primeng/dynamicdialog';
import { PaymentDialog } from '../../payment/payment';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  checkoutItems: any[] = [];
  totalAmount: number = 0;
  itemPrice: number = 0;
  taxPrice: number = 0;
  shippingPrice: number = 0;
  deliveryPrice: number = 0;
  order: any = '';

  payment: any = '';
  checkoutForm!: FormGroup;
  previousAddress: any;
  activeStep: number = 1;

  date: Date[] | undefined;

  paymentOptions = [
    { label: 'Cash on Delivery', value: 'COD' },
    { label: 'UPI Payment', value: 'Upi' },
    { label: 'Card Payment', value: 'Card' },
    { label: 'Netbanking', value: 'Netbanking' }
  ];

  constructor(private cartService: CartService, private dialogService: DialogService, private router: Router, private form: FormBuilder, private notify: NotificationService, private orderService: OrderService) {

    this.checkoutForm = this.form.group({
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postalCode: ['', [
        Validators.required,
        Validators.pattern("^[1-9][0-9]{5}$")
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern("^(\\+91[\\-\\s]?)?[0]?(91)?[789]\\d{9}$")
      ]],
      alternateNumber: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern("^(\\+91[\\-\\s]?)?[0]?(91)?[789]\\d{9}$")
      ]],
      payment: [null],
    });

  }


  ngOnInit(): void {

    this.buyNowSave();
    this.getLastAddress();

  }



  increaseQuantity(index: number) {
    this.checkoutItems[index].quantity++;
    this.calculateTotal();
  }


  decreaseQuantity(index: number) {
    if (this.checkoutItems[index].quantity > 1) {
      this.checkoutItems[index].quantity--;
      this.calculateTotal();
    }
  }


  calculateTotal() {

    let itemPrice = 0;
    let taxPrice = 0;

    this.checkoutItems.forEach(item => {
      const price = item.product.price;
      const oldPrice = item.product.oldPrice || price;

      const hasDiscount = oldPrice > price;

      itemPrice += price * item.quantity;

      if (!hasDiscount) {
        taxPrice += Number((price * 0.18 * item.quantity).toFixed(2));
      }
    });

    let shippingPrice = 0;
    let deliveryPrice = 0;

    if (itemPrice <= 1000) {
      shippingPrice = 20;
      deliveryPrice = 10;
    } else if (itemPrice <= 2000) {
      shippingPrice = 50;
      deliveryPrice = 20;
    } else {
      shippingPrice = Math.min(Number((itemPrice * 0.01).toFixed(2)), 100);
      deliveryPrice = Math.min(Number((itemPrice * 0.005).toFixed(2)), 50);
    }
    this.totalAmount = Number((itemPrice + taxPrice + shippingPrice + deliveryPrice).toFixed(2));
    this.taxPrice = taxPrice;
    this.shippingPrice = shippingPrice;
    this.itemPrice = itemPrice;
    this.deliveryPrice = deliveryPrice;
  }


  placeOrder() {

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    // if (!this.payment || this.payment.status != 'success') {
    //   this.notify.warning('Please complete your payment first')
    // } else {
    //   return;
    // }

    const shippingAddress = {

      fullName: this.checkoutForm.value.fullName,

      address: this.checkoutForm.value.address,

      city: this.checkoutForm.value.city,

      state: this.checkoutForm.value.state,

      country: this.checkoutForm.value.country,

      postalCode: this.checkoutForm.value.postalCode,

      phoneNumber: this.checkoutForm.value.phoneNumber,

      alternateNumber: this.checkoutForm.value.alternateNumber

    };

    const cartItems = this.checkoutItems.map(item => ({
      productId: item.product._id,
      qty: item.quantity
    }));

    const paymentDetails: any = {};
    const method = this.checkoutForm.value.payment;

    if (method === 'Upi') paymentDetails.upiId = this.checkoutForm.value.upiId;
    if (method === 'Card') {
      paymentDetails.cardNumber = this.checkoutForm.value.cardNumber;
      paymentDetails.cardName = this.checkoutForm.value.cardName;
      paymentDetails.expiry = this.checkoutForm.value.expiry;
      paymentDetails.cvv = this.checkoutForm.value.cvv;
    }
    if (method === 'Netbanking') {
      paymentDetails.bankName = this.checkoutForm.value.bankName;
      paymentDetails.transactionId = this.checkoutForm.value.transactionId;
    }


    const orderData = {
      cartItems,
      shippingAddress,
      paymentMethod: method,
      paymentDetails,
      itemPrice: this.itemPrice,
      taxPrice: this.taxPrice,
      shippingPrice: this.shippingPrice,
      totalPrice: this.totalAmount
    };

    this.orderService.placeOrder(orderData).subscribe({

      next: res => {

        if (!res.order || !res.order._id) {
          console.error('Order ID missing!');
          return;
        }

        this.notify.success('Order placed successfully');
        localStorage.removeItem('buyNowItem');

        this.order = res.order;

        const ref = this.dialogService.open(PaymentDialog, {
          header: 'Complete Your Payment',
          width: '600px',
          breakpoints: {
            '960px': '80vw',
            '640px': '90vw'
          },
          data: {
            orderId: res.order._id,
            amount: this.totalAmount,
            method: method
          },
          focusOnShow: false
        });

        ref.onClose.subscribe((success: boolean) => {
          if (success) {
            this.payment = { status: 'success' }
            this.router.navigate([`/user/order-confirmation/${res.order._id}`]);
          } else {
            this.payment = { status: 'fail' }
            this.notify.error('Payment failed or cancelled');
          }
        });
      },
      error: (err) => {
        console.log('Order failed', err);
        this.notify.error(err.error?.message || 'Order failed')
      }
    });
  }


  getLastAddress() {
    this.orderService.getLastAddress().subscribe({
      next: (res: any) => {

        if (res?.shippingAddress) {
          this.previousAddress = res.shippingAddress;
          this.checkoutForm.patchValue(res.shippingAddress);
        }
      },
      error: (err) => console.error(err)
    });
  }


  buyNowSave() {
    const buyNowItemParse = localStorage.getItem('buyNowItem')
    const buyNowItem = buyNowItemParse ? JSON.parse(buyNowItemParse) : null;

    if (buyNowItem && buyNowItem.product) {
      this.checkoutItems = [buyNowItem];
      this.calculateTotal();
    } else {
      this.cartService.getCart().subscribe({
        next: (res) => {
          this.checkoutItems = res.cart?.items || [];
          this.calculateTotal();
        },
        error: (err) => console.error(err)
      });
    };
  }


  proceedToPayment() {
    this.placeOrder();
  }



}
