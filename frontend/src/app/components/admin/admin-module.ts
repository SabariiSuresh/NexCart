import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { CategoryForm } from './category-form/category-form';
import { CategoryList } from './category-list/category-list';
import { Dashboard } from './dashboard/dashboard';
import { Orders } from './orders/orders';
import { Payments } from './payments/payments';
import { ProductForm } from './product-form/product-form';
import { ProductList } from './product-list/product-list';
import { MaterialsModule } from '../../materials/materials-module';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    CategoryForm,
    CategoryList,
    Dashboard,
    Orders,
    Payments,
    ProductForm,
    ProductList,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialsModule,
    SharedModule
  ]
})
export class AdminModule { }
