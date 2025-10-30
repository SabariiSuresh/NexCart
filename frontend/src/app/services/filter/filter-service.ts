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
    fashion: ['mens clothing', 'mens footware','womens clothing', 'womens footware',  'accessories', 'watch', 'jewelry'],
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
    this.brands = Array.from(new Set(products.map(p => p.brand).filter(b => b)));
    this.brandOptions = this.brands.map(b => ({ label: b, value: b }));
  }

  applyFilters(products: any[]): any[] {

    return products.filter(p => {
      const priceCond =
        !this.priceRange || (p.price >= this.priceRange[0] && p.price <= this.priceRange[1]);

      const discountCond =
        !this.selectedDiscounts.length ||
        this.selectedDiscounts.some(d => Number(p.discount) >= Number(d));

      const ratingCond =
        !this.selectedRating || (p.rating || 0) >= this.selectedRating;

      const brandCond =
        !this.selectedBrands.length ||
        this.selectedBrands.includes(p.brand);

      const categoryName = (p.category?.name || '');
      const categoryType = (p.category?.type || '');

      const categoryCond =
        !this.selectedCategory ||
        this.categoryMap[this.selectedCategory]?.some(keyword => {
          return (
            categoryName.toLowerCase() === keyword.toLowerCase() ||
            categoryType.toLowerCase() === keyword.toLowerCase()
          );
        });

      const subcategoryCond =
        !this.selectedSubcategories.length ||
        this.selectedSubcategories?.some(sc =>
          [categoryName, categoryType].some(
            cat => cat.toLowerCase() === sc.toLowerCase()
          )
        );

      return (
        priceCond &&
        discountCond &&
        ratingCond &&
        brandCond &&
        categoryCond &&
        subcategoryCond
      );
    });
  }


  resetFilter() {
    this.priceRange = [0, 50000];
    this.selectedBrands = [];
    this.selectedDiscounts = [];
    this.selectedRating = 0;
    this.selectedSubcategories = [];
  }


}
