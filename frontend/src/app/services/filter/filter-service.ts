import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  priceRange: number[] = [0, 50000];
  selectedBrands: string[] = [];
  selectedDiscounts: number[] = [];
  selectedRating: number = 0;

  brands: string[] = [];
  brandOptions: { label: string, value: string }[] = [];

  selectedCategory: string = '';
  selectedSubcategories: string[] = [];
  isParent: boolean = true;

  categoryMap: Record<string, string[]> = {
    fashion: ['mens clothing', 'mens footware', 'womens clothing', 'womens footware', 'accessories', 'watch', 'jewelry'],
    electronics: ['mobiles', 'laptops', 'headphones', 'cameras', 'speaker'],
    home: ['furniture', 'decor', 'appliances'],
    beauty: ['skincare', 'makeup', 'haircare'],
    sports: ['fitness', 'outdoor', 'athletics'],
  };


  get categories(): { label: string, value: string }[] {
    return Object.keys(this.categoryMap).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: key
    }));
  }

  get subcategoryOptions(): { label: string, value: string }[] {
    if (!this.isParent || !this.selectedCategory) return [];
    return this.categoryMap[this.selectedCategory].map(sc => ({ label: sc.charAt(0).toUpperCase() + sc.slice(1), value: sc }));
  }


  prepareFilter(products: any[]) {
    this.brands = Array.from(
      new Set(products.map(p => p.brand?.toLowerCase()).filter(Boolean))
    );
    this.brandOptions = this.brands.map(b => ({
      label: b.charAt(0).toUpperCase() + b.slice(1),
      value: b
    }));
  }

  applyFilters(products: any[]): any[] {

    if (!products?.length) return [];

    return products.filter(p => {

      // 💰 Price filter
      const priceMatch =
        (!this.priceRange?.length) ||
        (p.price >= this.priceRange[0] && p.price <= this.priceRange[1]);

      // 🏷 Brand filter
      const brandMatch =
        !this.selectedBrands.length ||
        this.selectedBrands.includes(p.brand?.toLowerCase());

      // ⭐ Rating filter
      const ratingMatch =
        !this.selectedRating ||
        p.rating >= this.selectedRating;

      // 🔖 Discount filter
      const discountMatch =
        !this.selectedDiscounts.length ||
        this.selectedDiscounts.some(d => p.discount >= d);

      // 📦 Subcategory filter (optional for wishlist/cart)
      const subcategoryMatch =
        !this.selectedSubcategories.length ||
        this.selectedSubcategories.includes(p.category?.type?.toLowerCase());

      return (
        priceMatch &&
        brandMatch &&
        ratingMatch &&
        discountMatch &&
        subcategoryMatch
      );
    });
  }


  resetFilter() {
    this.priceRange = [0, 200000];
    this.selectedBrands = [];
    this.selectedDiscounts = [];
    this.selectedRating = 0;
    this.selectedSubcategories = [];
  }


}
