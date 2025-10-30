import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';
import { AuthService } from '../../services/auth/auth-service';
import { FilterService } from '../../services/filter/filter-service';

@Component({
  selector: 'app-category-product',
  standalone: false,
  templateUrl: './category-product.html',
  styleUrl: './category-product.css'
})
export class CategoryProduct implements OnInit {

  categoryName = '';
  products: any[] = [];

  paginatedProducts: any[] = [];
  pageSize: number = 9;
  currentPage: number = 0;

  filteredProducts: any[] = [];

  constructor(private auth: AuthService, private productService: ProductService, private route: ActivatedRoute, private router: Router, private notify: NotificationService, private filter: FilterService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('category') || '';
      if (categoryId) {
        this.loadCategoryproduct(categoryId);
      }
    });
  }


  loadCategoryproduct(categoryId: string) {

    this.productService.getProductByCategory(categoryId).subscribe({

      next: (res) => {

        this.products = res.products || res;
        this.categoryName = res.category || '';
        this.filteredProducts = [...this.products];
        this.filter.prepareFilter(this.products)
        this.setPaginatedProducts();
        this.categoryType(this.categoryName);
        this.applyFilters();
        console.log(categoryId, this.categoryName)
      },
      error: err => console.error(err)
    })
  }


  categoryType(categoryId: string) {

    const category = categoryId.toLowerCase().trim();
    this.filter.isParent = Object.keys(this.filter.categoryMap).includes(category);

    if (this.filter.isParent) {
      this.filter.selectedCategory = category;
      this.filter.selectedSubcategories = [];
    } else {
      this.filter.selectedCategory = '';
      this.filter.selectedSubcategories = [];

      for (const parent of Object.keys(this.filter.categoryMap)) {
        if (this.filter.categoryMap[parent].includes(category)) {
          this.filter.selectedSubcategories = [category];
        }
      }

    }

  }


  applyFilters() {
    this.filteredProducts = this.filter.applyFilters(this.products)

    if (this.filteredProducts.length === 0) {
      this.notify.warning('No products match the selected filters.');
    }

    this.currentPage = 0;
    this.setPaginatedProducts();
  }


  buyNow(product: any) {

    if (this.auth.isLoggedIn()) {
      const item = { product: { ...product }, quantity: 1 };
      localStorage.setItem('buyNowItem', JSON.stringify(item));
      this.router.navigate(['/user/checkout']);
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/user/checkout');
      this.notify.warning('login to buy this product');
      this.auth.openAuthDialoge();
    }
  }


  viewProduct(productId: string) {
    this.router.navigate(['/product', productId])
  }



  setPaginatedProducts() {

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }


  onPageChange(event: any) {

    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.setPaginatedProducts();

  }



}
