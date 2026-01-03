import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification-service';
import { AuthService } from '../../services/auth/auth-service';
import { FilterService } from '../../services/filter/filter-service';
import { CategoryService } from '../../services/category/category-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category-product',
  standalone: false,
  templateUrl: './category-product.html',
  styleUrl: './category-product.css'
})
export class CategoryProduct implements OnInit {

  environment = environment;

  categoryName = '';
  products: any[] = [];
  parrentCatId = '';

  filteredProducts: any[] = [];

  constructor(private auth: AuthService, private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private notify: NotificationService, private filter: FilterService) { }

  ngOnInit(): void {

    this.filter.resetFilter();

    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id') || '';
      if (categoryId) {
        this.loadCategoryContex(categoryId)
        this.loadCategoryproduct(categoryId);
      }
    });
  }


  loadCategoryproduct(categoryId: string) {

    this.parrentCatId = categoryId;

    this.categoryService.getProductsFromParentcat(categoryId).subscribe({

      next: (res) => {

        this.products = res.products || res;
        this.filteredProducts = [...this.products];
        this.filter.prepareFilter(this.products)
      },
      error: err => console.error(err)
    });

  }

  loadCategoryContex(categoryId: string) {

    this.categoryService.getCategoriesById(categoryId).subscribe({

      next: (res) => {
        const category = res.category || res;

        const type = category.type?.toLowerCase();

        if (!type) return;

        if (this.filter.categoryMap[type]) {
          this.filter.isParent = true;
          this.filter.selectedCategory = type;
          this.filter.selectedSubcategories = [];
        } else {
          this.filter.isParent = false;
          this.filter.selectedCategory = '';

          for (const parent of Object.keys(this.filter.categoryMap)) {
            if (this.filter.categoryMap[parent].includes(type)) {
              this.filter.selectedCategory = parent;
              this.filter.selectedSubcategories = [type];
              break;
            }
          }
        }
      },
      error: err => console.error('Category context load failed', err)
    });
  }


  getCategoryAndChildrenIds(categoryId: string, categories: any[]): string[] {
    let ids: string[] = [categoryId];
    const cat = categories.find(c => c._id === categoryId);
    if (cat?.children?.length) {
      cat.children.forEach((child: any) => {
        ids = ids.concat(this.getCategoryAndChildrenIds(child._id, categories));
      });
    }
    return ids;
  }


  applyFilters() {

    const params: any = {
      parentCategoryId: this.parrentCatId,
      subcategories: this.filter.selectedSubcategories.join(','),
      brand: this.filter.selectedBrands.join(','),
      minPrice: this.filter.priceRange[0],
      maxPrice: this.filter.priceRange[1],
      rating: this.filter.selectedRating,
      discount: this.filter.selectedDiscounts.length
        ? Math.max(...this.filter.selectedDiscounts)
        : ''
    };

    this.categoryService.getFilteredProducts(params).subscribe({
      next: (res) => {
        this.filteredProducts = res.products;

        if (!this.filteredProducts.length) {
          this.notify.warning('No products match the selected filters.');
        }

      },
      error: err => console.error(err)
    });
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



}
