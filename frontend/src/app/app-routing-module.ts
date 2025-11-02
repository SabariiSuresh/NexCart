import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductView } from './components/products/products';
import { CategoryProduct } from './components/category-product/category-product';
import { Search } from './components/search/search';
import { Wildcard } from './components/wildcard/wildcard';
import { Section } from './components/section/section';

const routes: Routes = [

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'product/:id', component: ProductView },
  { path: 'category/:category', component: CategoryProduct },
  { path: 'search', component: Search },

  { path: 'section/:key', loadChildren: () => import('./components/section/section-module').then(m => m.SectionModule) },

  { path: 'user', loadChildren: () => import('./components/user/user-module').then(m => m.UserModule) },

  { path: 'admin', loadChildren: () => import('./components/admin/admin-module').then(m => m.AdminModule) },

  { path: '**', component: Wildcard }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
