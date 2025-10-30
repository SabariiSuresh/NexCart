import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { MaterialsModule } from '../../materials/materials-module';
import { SharedModule } from '../shared/shared-module';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { Wishlist } from './wishlist/wishlist';
import { MyPayments } from './my-payments/my-payments';
import { OrderDetails } from './order-details/order-details';
import { OrderConfirmationAndTrack } from './order-confirmation-and-track/order-confirmation-and-track';
import { MyOrders } from './my-orders/my-orders';


@NgModule({
  declarations: [
    Cart,
    Checkout,
    Wishlist,
    MyOrders,
    MyPayments,
    OrderDetails,
    OrderConfirmationAndTrack,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialsModule,
    SharedModule
  ]
})
export class UserModule { }
