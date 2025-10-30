import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterService } from '../../../services/filter/filter-service';

@Component({
  selector: 'app-filters',
  standalone: false,
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class Filters {

  @Input() type: 'product' | 'order' = 'product'
  @Output() filtersChanged = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<string>()

  orderStatuses: string[] = ['All', 'On the way', 'Delivered', 'Cancelled'];
  selectedStatus: string = 'All';
  showDrawer: boolean = false;

  constructor(public filter: FilterService) { }

  apply() {
    this.filtersChanged.emit();
  }

  reset() {
    this.filter.resetFilter();
    this.filtersChanged.emit();
  }

  filterOrderStatus(status: string) {
    this.selectedStatus = status;
    this.statusChanged.emit(this.selectedStatus);
  }

  onCategoryChange(selectedCategory: string) {
    this.filter.selectedCategory = selectedCategory;
    this.filter.selectedSubcategories = [];
  }


}
