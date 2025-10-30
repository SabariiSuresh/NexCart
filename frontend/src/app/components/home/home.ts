import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product-service';
import { CategoryService } from '../../services/category/category-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';



@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  banners = [
    { image: 'assets/bigsale.png' },
    { image: 'assets/new.png' },
    { image: 'assets/offer.png' }
  ];

  categories: any[] = [];
  products: any[] = [];
  productSections: any[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSections();
  }

  loadCategories() {
    this.categoryService.getPublicCategories().subscribe({
      next: (res) => {
        this.categories = res.categories || res;
      },
      error: (err) => { console.error('Failed to fetch categories', err); }
    });
  }


  loadSections() {

    this.productService.getSections(6).subscribe({
      next: (res: any) => {
        const blocks = [];

        if (res.deals?.length) {
          blocks.push({ title: 'Deals of the Day', key: 'deals', products: res.deals });
        }

        if (res.topProducts?.length) {
          blocks.push({ title: 'Top Products for You', key: 'topProducts', products: res.topProducts });
        }

        if (res.topElectronics?.length) {
          blocks.push({ title: 'Top Electronics', key: 'topElectronics', products: res.topElectronics });
        }

        if (res.topSpeakers?.length) {
          blocks.push({ title: 'Top Deals on Speakers', key: 'topSpeakers', products: res.topSpeakers });
        }

        if (res.topFashions?.length) {
          blocks.push({ title: 'Fashions Top Deals', key: 'topFashions', products: res.topFashions });
        }

        if (res.topToys?.length) {
          blocks.push({ title: 'Kids Toys and More...', key: 'topToys', products: res.topToys });
        }

        this.productSections = blocks;
      },
      error: (err) => console.error(err)
    });

    if (this.authService.isLoggedIn()) {
      this.productService.getRecommended(8).subscribe({
        next: (res: any) => {
          const recommendedProducts = res.products || [];
          if (recommendedProducts.length > 0) {
            this.productSections.unshift({
              title: 'Recommended for You',
              key: 'recommended',
              products: recommendedProducts
            });
          }
        },
        error: (err) => console.error('Recommended fetch failed', err)
      });
    }
  }


  viewCategory(categoryId: string) {
    this.router.navigate(['/category', categoryId]);
  }

  viewProduct(productId: string) {
    this.router.navigate(['/products', productId]);
    console.log('click', productId)
  }

}
