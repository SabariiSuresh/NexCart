import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { FilterService } from '../../services/filter/filter-service';
import { NotificationService } from '../../services/notification/notification-service';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {

  products: any[] = [];
  product: any;
  totalProducts = 0;
  page = 1;
  limit = 10;
  query = '';
  loading = false;

  filteredProducts: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private cart: CartService,
    private router: Router,
    private productService: ProductService,
    private notify: NotificationService,
    private filter: FilterService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.page = +params['page'] || 1;
      this.fetchProducts();
    });
  }

  fetchProducts() {
    if (!this.query) {
      this.products = [];
      this.totalProducts = 0;
      return;
    }

    this.loading = true;
    this.productService.searchProduct(this.query, this.page, this.limit).subscribe({
      next: (res) => {
        this.products = res.products || [];
        this.totalProducts = res.total || this.products.length;
        this.filter.prepareFilter(this.products);
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: (err) => {
        console.error('Search error', err);
        this.products = [];
        this.totalProducts = 0;
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.filter.applyFilters(this.products);
    this.totalProducts = this.filteredProducts.length;

    if (this.filteredProducts.length === 0) {
      this.notify.warning('No products match the selected filters.');
    }
  }

  buyNow(product: any) {

    if (this.auth.isLoggedIn()) {
      const item = { product: { ...product }, quantity: 1 };
      localStorage.setItem('buyNowItem', JSON.stringify(item));
      this.router.navigate(['/user/checkout']);
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      this.notify.warning('login to buy this product');
      this.auth.openAuthDialoge();
    }
  }


  viewProduct(productId: string) {
    this.router.navigate(['/product', productId])
  }

  addToCart(product: any, quantity: number = 1) {

    if (!product) return;

    if (!this.auth.isLoggedIn()) {
      this.notify.warning('Please login to add products to cart');
      this.auth.openAuthDialoge();
      return;
    }
    this.cart.addToCart(product._id, quantity).subscribe({
      next: res => {
        this.notify.success(`${product.name} added to cart!`);
      },
      error: err => {
        console.error(err);

        if (err.status === 401) {
          this.notify.warning('Login to add products to cart');
          this.auth.openAuthDialoge();
        } else {
          this.notify.error('Failed to add to cart');
        }

      }
    });
  }


  onPaginatorChange(event: any) {
    this.page = event.page + 1;
    this.limit = event.rows;
    this.router.navigate(['/search'], {
      queryParams: { q: this.query, page: this.page }
    });
  }

  get paginatedProducts() {
    const start = (this.page - 1) * this.limit;
    return this.filteredProducts.slice(start, start + this.limit);
  }

}
