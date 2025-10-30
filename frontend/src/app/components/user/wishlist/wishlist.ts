import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../services/wishlist/wishlist-service';
import { NotificationService } from '../../../services/notification/notification-service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter/filter-service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {

  wishlists: any[] = [];
  product: any[] = [];

  filteredProducts: any[] = [];

  paginatedProducts: any[] = [];
  pageSize: number = 8;
  currentPage: number = 0;

  constructor(private wishlistService: WishlistService, private filter: FilterService, private notify: NotificationService, private confirmationService: ConfirmationService, private router: Router) { }

  ngOnInit(): void {
    this.loadWishlist();
  }


  loadWishlist() {

    this.wishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlists = res.wishList?.items || [];
      },
      error: (err) => {
        this.notify.error('Failed to get wishlist');
        console.error('Failed to fetch wishlist', err)
      }
    })
  }


  remove(event: Event, productId: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Are you sure you want to remove this product?',
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
        this.wishlistService.removeWishlist(productId).subscribe({
          next: (res) => {
            this.notify.success('Removed from wishlist');
            this.loadWishlist();
          },
          error: (err) => {
            this.notify.error('Failed to remove');
            console.error('Remove error:', err);
          }
        });
      }
    });
  }

  applyFilters() {
    this.filteredProducts = this.filter.applyFilters(this.product)

    if (this.filteredProducts.length === 0) {
      this.notify.warning('No products match the selected filters.');
    }

    this.currentPage = 0;
    this.setPaginatedProducts();
  }

  moveToCart(productId: string) {

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
