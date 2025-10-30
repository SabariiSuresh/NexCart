import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';
import { AuthService } from '../../services/auth/auth-service';
import { NotificationService } from '../../services/notification/notification-service';
import { WishlistService } from '../../services/wishlist/wishlist-service';
import { Feature } from '../../services/feature-grouping/feature';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductView implements OnInit {

  topFeatures: { key: string, value: string }[] = [];
  featureGroups: { name: string, features: { key: string, value: string, tooltip?: string }[] }[] = [];

  product: any;
  recommended: any[] = [];
  wishlist: string[] = [];

  paginatedProducts: any[] = [];
  pageSize: number = 6;
  currentPage: number = 0;

  constructor(private authService: AuthService, private cartservice: CartService, private wishlistService: WishlistService,private featureService : Feature , private productService: ProductService, private route: ActivatedRoute, private notify: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) this.loadProduct(productId);
    });
    this.loadWishlist();
  }



  loadProduct(productId: string) {

    this.productService.getProductById(productId).subscribe({

      next: (res) => {

        this.product = res.product || res;
        this.recommended = res.recommended || [];
        this.setPaginatedProducts();

        if (!this.product?.features) return;
        if (this.product?.features) {

          const allFeatures: { key: string; value: string; tooltip?: string }[] =
            Object.entries(this.product.features).map(([key, value]) => ({
              key,
              value: String(value),
              tooltip: this.generateTooltip(key)
            }));

          this.topFeatures = allFeatures.slice(0, 5);

          const categoryType = this.product.category?.type || '';
          this.featureGroups = this.featureService.groupFeatures(categoryType, this.product.features);
        }

      }, error: err => {

        this.notify.error('Failed to load this product');
        console.error(err);
      }
    });

  }


  addToCart(quantity: number = 1) {

    if (!this.product) return;

    this.cartservice.addToCart(this.product._id, quantity).subscribe({

      next: res => {
        this.notify.success('Added to cart');
      },
      error: err => {
        console.error(err);

        if (err.status === 401) {
          this.notify.warning('login to add products to cart');
          this.authService.openAuthDialoge();
        } else {
          this.notify.error('Failed to add to cart');
        }

      }
    })
  }


  generateTooltip(key: string): string | undefined {
    const tooltips: Record<string, string> = {
      screen: 'Screen details including type and size',
      battery: 'Battery capacity in mAh',
      camera: 'Camera specs and megapixels'
    };
    return tooltips[key.toLowerCase()];
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (res: any) => {
        if (res.wishList && res.wishList.items) {
          this.wishlist = res.wishList.items.map((item: any) => item.product._id);
        } else {
          this.wishlist = [];
        }
      },
      error: (err) => {
        console.error('Failed to load wishlist', err);
      }
    });
  }


  addToWishlist(productId: string) {
    if (this.isInWishlist(productId)) {
      this.notify.success('Already in wishlist');
      return;
    }

    this.wishlistService.addWishlist({ productId }).subscribe({
      next: () => {
        this.notify.success('Added to wishlist');
        this.wishlist.push(productId);
      },
      error: err => {
        if (err.status === 400) this.notify.warning('Already in wishlist');
        else this.notify.error('Failed to add to wishlist');
        console.error("Wishlist error", err);
      }
    });
  }



  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  buyNow() {
    if (!this.product) return;

    if (this.authService.isLoggedIn()) {
      const item = { product: { ...this.product }, quantity: 1 };
      localStorage.setItem('buyNowItem', JSON.stringify(item));
      this.router.navigate(['/user/checkout']);
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      this.notify.warning('login to buy this product');
      this.authService.openAuthDialoge();
    }
  }

  setPaginatedProducts() {

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.recommended.slice(start, end);
  }


  onPageChange(event: any) {

    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.setPaginatedProducts();

  }


  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  toString(value: unknown): string {
    return value != null ? String(value) : '';
  }


  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

}
