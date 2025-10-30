import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { ProductService } from '../../services/product/product-service';
import { NotificationService } from '../../services/notification/notification-service';
import { DialogService } from 'primeng/dynamicdialog';
import { Profile } from '../profile/profile';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  userMenuItems: MenuItem[] = [];
  adminMenuItems: MenuItem[] = [];
  userName: string = '';

  filteredSuggestions: any[] = [];
  searchKeywordValue: string = '';
  selectedProduct: any = null;

  mobileMenuVisible: boolean = false;


  constructor(private notify: NotificationService, private router: Router, private authservice: AuthService, private productService: ProductService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.authservice.userName$.subscribe(name => {
      this.userName = name;
      if (this.isLoggedIn && name) {
        this.menuList();
      }
    })
  }

  menuList() {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.profile()
      },
      {
        label: 'Orders',
        icon: 'pi pi-shopping-bag',
        command: () => this.myOrder()
      },
      {
        label: 'Payments',
        icon: 'pi pi-wallet',
        command: () => this.myPayments()
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        styleClass: 'font-semibold',
        command: () => this.logOut()
      }
    ];
    this.adminMenuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        command: () => this.navigate('dashboard')
      },
      {
        label: 'Products',
        icon: 'pi pi-box',
        command: () => this.navigate('products')
      },
      {
        label: 'Category',
        icon: 'pi pi-tags',
        command: () => this.navigate('category')
      },
      {
        label: 'Orders',
        icon: 'pi pi-shopping-bag',
        command: () => this.navigate('orders')
      },
      {
        label: 'Payments',
        icon: 'pi pi-credit-card',
        command: () => this.navigate('payments')
      },
      {
        separator: true
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.profile()
      },
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        styleClass: 'font-semibold',
        command: () => this.logOut()
      }
    ];

  }


  searchSuggestions(event: any) {

    const query = (event.query || '').trim();

    if (!query || query.length < 2) {
      this.filteredSuggestions = [];
      return;
    }

    this.productService.quickSearch(query).subscribe({

      next: (res) => {
        this.filteredSuggestions = res.products || [];
      },
      error: (err) => {
        console.error('quick search error', err);
        this.filteredSuggestions = [];
      }
    })

  }

  get searchKeyword() {
    return this.selectedProduct ? this.selectedProduct.name : this.searchKeywordValue;
  }

  set searchKeyword(value: any) {

    if (typeof value === 'string') {

      this.searchKeywordValue = value;
      this.selectedProduct = null;
    } else {
      this.selectedProduct = value;
    }

  }

  selectSuggestion(product: any) {

    if (product && product._id) {
      this.selectedProduct = product;
      this.searchKeywordValue = product.name;
      this.router.navigate(['/product', product._id]);
      setTimeout(() => this.clearSearch(), 500);
    }
  }


  onSearchInput() {
    const query = this.searchKeywordValue.trim();
    if (query.length < 2) {
      this.filteredSuggestions = [];
      return;
    }

    this.productService.quickSearch(query).subscribe({
      next: (res) => this.filteredSuggestions = res.products || [],
      error: () => this.filteredSuggestions = []
    });
  }


  onSearch() {
    if (!this.searchKeyword || (typeof this.searchKeyword === 'string' && !this.searchKeyword.trim())) {
      this.notify.warning('Please enter a keyword');
      return;
    }

    const q = typeof this.searchKeyword === 'string' ? this.searchKeyword.trim() : this.searchKeyword.name;
    this.clearSearch();
    this.router.navigate(['/search'], { queryParams: { q } });

  }

  toggleView() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  closeDrawer() {
    this.mobileMenuVisible = false
  }

  clearSearch() {
    this.searchKeyword = '';
    this.filteredSuggestions = [];
  }


  home() {
    this.router.navigate(['/home'])
  }

  get isLoggedIn() {
    return this.authservice.isLoggedIn();
  }

  get userRole(): string {
    return this.authservice.getRole();
  }


  logOut() {
    setTimeout(() => {
      this.authservice.logOut();
    }, 1000)
    this.notify.success('You Logouted');
  }

  navigate(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  cartView() {

    if (this.authservice.isLoggedIn()) {
      this.router.navigate(['/user/cart'])
    } else {
      this.notify.warning('Please Login to access')
    }
  }


  wishlistView() {
    if (this.authservice.isLoggedIn()) {
      this.router.navigate(['/user/wishlist'])
    } else {
      this.notify.warning('Please Login to access')
    }
  }

  profile() {
    this.dialogService.open(Profile, {
      width: '675px',
      contentStyle: {
        padding: '0',
        overflow: 'auto',
        maxHeight: '90vh'
      },
      baseZIndex: 10000,
      closable: false
    });
  }


  myOrder() {
    this.router.navigate(['/user/my-orders'])
  }



  myPayments() {
    this.router.navigate(['/user/my-payments'])
  }



}
