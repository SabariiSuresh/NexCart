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

  orderStatuses: string[] = ['All', 'Pending', 'Delivered', 'Cancelled'];
  selectedStatus: string = 'All';
  showDrawer: boolean = false;

  constructor(public filter: FilterService) { }

  apply() {
    this.filtersChanged.emit();
    this.showDrawer = false;
  }

  reset() {
    this.filter.resetFilter();
    this.filtersChanged.emit();
    this.showDrawer = false;
  }

  filterOrderStatus(status: string) {
    this.selectedStatus = status;
    this.statusChanged.emit(this.selectedStatus);
    this.showDrawer = false;
  }


}
