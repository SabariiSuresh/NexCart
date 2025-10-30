import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { Navbar } from './components/navbar/navbar';
import { MaterialsModule } from './materials/materials-module';
import { Home } from './components/home/home';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Auth } from './components/auth/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ProductView } from './components/products/products';
import { Tree } from "primeng/tree";
import { AuthInterceptor } from './interceptor/interceptor-interceptor';
import { CategoryProduct } from './components/category-product/category-product';
import { Search } from './components/search/search';
import { SelectItem } from "primeng/select";
import { DatePicker } from "primeng/datepicker";
import { PaymentDialog } from './components/payment/payment';
import { DialogService } from 'primeng/dynamicdialog';
import { Profile } from './components/profile/profile';
import { Badge } from "primeng/badge";
import { SharedModule } from './components/shared/shared-module';
import { Wildcard } from './components/wildcard/wildcard';


@NgModule({
  declarations: [
    App,
    Navbar,
    Home,
    Auth,
    ProductView,
    CategoryProduct,
    Search,
    PaymentDialog,
    Profile,
    Wildcard
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Tree,
    SelectItem,
    DatePicker,
    Badge,
    SharedModule
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DialogService,
    provideBrowserGlobalErrorListeners(),
    MessageService,
    ConfirmationService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
