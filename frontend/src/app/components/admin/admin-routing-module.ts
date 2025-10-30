import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { CategoryList } from './category-list/category-list';
import { ProductList } from './product-list/product-list';
import { Orders } from './orders/orders';
import { Payments } from './payments/payments';
import { AuthGuard } from '../../guard/auth-guard-guard';
import { AdminGuard } from '../../guard/admin-guard-guard';

const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard, AdminGuard] },
  { path: 'category', component: CategoryList, canActivate: [AuthGuard, AdminGuard] },
  { path: 'products', component: ProductList, canActivate: [AuthGuard, AdminGuard] },
  { path: 'orders', component: Orders, canActivate: [AuthGuard, AdminGuard] },
  { path: 'payments', component: Payments, canActivate: [AuthGuard, AdminGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
