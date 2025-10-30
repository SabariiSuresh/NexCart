import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart/cart-service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  product: any = '';
  cartItems: any[] = [];

  paginatedProducts: any[] = [];
  pageSize: number = 5;
  currentPage: number = 0;

  constructor(private cartService: CartService, private router: Router, private notify: NotificationService, private confirmService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {

    this.cartService.getCart().subscribe({

      next: (res) => {

        this.cartItems = res.cart?.items || [];

        console.log(this.cartItems)
        this.setPaginatedProducts()
      },
      error: err => {
        console.error(err);
      }
    })
  }

  removeItem(event: Event, productId: string) {

    this.confirmService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure? you want to remove this item!',
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

        this.cartService.removeItem(productId).subscribe({
          next: res => {
            this.notify.success('Item removed from cart');
            this.loadCart();
          },
          error: err => console.error(err)
        })
      }
    });
  }

  get totalDiscount() {
    return this.cartItems.reduce((acc, item) => {
      const oldPrice = item.product.oldPrice || 0;
      const currentPrice = item.product.price || 0;
      const discountPerItem = (oldPrice - currentPrice) * item.quantity;
      return acc + (discountPerItem > 0 ? discountPerItem : 0);
    }, 0);
  }


  clearCart(event: Event) {
    this.confirmService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure? you want to clear this cart!',
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

        this.cartService.clearCart().subscribe({
          next: res => {
            this.notify.success('cleared');
            this.loadCart();
          },
          error: err => console.error(err)
        })
      }
    })
  }



  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }


  buyNow(product: any) {
    const item = { product: { ...product }, quantity: 1 };
    localStorage.setItem('buyNowItem', JSON.stringify(item));
    this.router.navigate(['/user/checkout']);
  }



  placeOrder() {
    localStorage.removeItem('buyNowItem');
    this.router.navigate(['/user/checkout'])
  }


  get total() {

    return this.cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  }


  setPaginatedProducts() {

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.cartItems.slice(start, end);
  }


  onPageChange(event: any) {

    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.setPaginatedProducts();

  }


}

