import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product-service';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { CategoryService } from '../../../services/category/category-service';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  selectedProduct: any = null;
  filteredSuggestions: any[] = [];

  categories: any[] = [];
  selectedCategory: any = null;

  categoryTree: any;

  displayForm = false;
  formTitle = 'Add Products';
  searchKeyword: any = '';

  constructor(private categoryService: CategoryService, private productService: ProductService, private notify: NotificationService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({

      next: (res: any) => {
        this.products = res.products;
        this.filteredProducts = res.products;
      }, error: err => {
        console.error('Error to fetch product', err);
      }

    })
  }


  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categoryTree = this.buildTree(res.categories);
      },
      error: err => console.error('Error fetching categories', err)
    });
  }

  searchSuggestions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSuggestions = this.products.filter(prd =>
      prd.name.toLowerCase().includes(query));
    console.log(event)
  }


  filterProducts() {
    let keyword = '';

    if (this.searchKeyword && typeof this.searchKeyword === 'object') {
      keyword = this.searchKeyword.name.toLowerCase();
      this.searchKeyword = this.searchKeyword.name;
    } else if (typeof this.searchKeyword === 'string') {
      keyword = this.searchKeyword.trim().toLowerCase();
    }

    if (!keyword) {
      this.filteredProducts = [...this.products];
      return;
    }

    const results = this.products.filter(p =>
      p.name.toLowerCase().includes(keyword)
    );

    if (results.length === 0) {
      this.notify.warning('No products match your search.');
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = results;
    }
  }



  buildTree(categories: any[]): TreeNode[] {

    return categories.map(cat => ({

      label: cat.name,
      key: cat._id,
      data: cat._id,
      children: cat.children ? this.buildTree(cat.children) : []

    }))

  }



  filterByCategory() {
    if (!this.selectedCategory) {
      this.loadProducts();
      return;
    }

    const categoryId =
      this.selectedCategory?.key ||
      this.selectedCategory?.data ||
      this.selectedCategory;

    this.productService.getProductByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.filteredProducts = res.products;

        if (this.filteredProducts.length === 0) {
          this.notify.warning('No products found in this category');
        } else {
          this.notify.success(`${this.filteredProducts.length} products found`);
        }
      },
      error: err => {
        if (err.status == 404) {
          this.notify.error('No products found in this category');
        } else {
          console.error('Error fetching by category', err);
        }
      }
    });
  }



  openForm() {

    this.selectedProduct = null;
    this.formTitle = 'Add Products';
    this.displayForm = true;

  }

  editProduct(product: any) {

    this.selectedProduct = product;
    this.formTitle = 'Edit Product';
    this.displayForm = true;

  }


  deleteProduct(event: Event, id: string) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {

        this.productService.deleteProduct(id).subscribe({

          next: () => {
            this.notify.success('Product deleted');
            this.filteredProducts = this.filteredProducts.filter(p => p._id !== id);
            this.loadProducts();
          }, error: err => {
            this.notify.error('failed to delete');
            console.error('Delete error', err);
          }
        })
      }

    })

  }


  onFormSaved(saved: boolean) {

    if (saved) {
      this.loadProducts();
      this.displayForm = false;
    }

  }

}
