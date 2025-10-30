import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { OrderConfirmationAndTrack } from './order-confirmation-and-track/order-confirmation-and-track';
import { MyOrders } from './my-orders/my-orders';
import { OrderDetails } from './order-details/order-details';
import { MyPayments } from './my-payments/my-payments';
import { Wishlist } from './wishlist/wishlist';
import { AuthGuard } from '../../guard/auth-guard-guard';

const routes: Routes = [
  { path: 'cart', component: Cart, canActivate: [AuthGuard] },
  { path: 'checkout', component: Checkout, canActivate: [AuthGuard] },
  { path: 'order-confirmation/:id', component: OrderConfirmationAndTrack, canActivate: [AuthGuard] },
  { path: 'my-orders', component: MyOrders, canActivate: [AuthGuard] },
  { path: 'my-orders/:id', component: OrderDetails, canActivate: [AuthGuard] },
  { path: 'my-payments', component: MyPayments, canActivate: [AuthGuard] },
  { path: 'wishlist', component: Wishlist, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
