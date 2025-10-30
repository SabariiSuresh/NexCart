import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category/category-service';
import { ConfirmationService } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {

  categories: any[] = [];
  filteredCategories: any[] = [];
  selectedCategory: any = null;
  filteredSuggestions: any[] = [];

  categoryTree: any;

  displayForm = false;
  formTitle = 'Add Categories';
  searchKeyword: any = '';

  constructor(private categoryService: CategoryService, private notify: NotificationService, private confirmationMessage: ConfirmationService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {

    this.categoryService.getCategories().subscribe({

      next: (res) => {
        this.categories = res.categories;
        this.filteredCategories = this.categories;
        this.prepareCategoryTree();
      }, error: err => {
        console.log(err);
      }
    })
  }

  searchSuggestions(event: any) {
    const query = event.query.toLowerCase();
    this.filteredSuggestions = this.categories.filter(cat =>
      cat.name.toLowerCase().includes(query));
  }


  filterCategories() {
    let keyword = '';

    if (this.searchKeyword && typeof this.searchKeyword === 'object') {
      keyword = this.searchKeyword.name.toLowerCase();
      this.searchKeyword = this.searchKeyword.name;
    } else if (typeof this.searchKeyword === 'string') {
      keyword = this.searchKeyword.trim().toLowerCase();
    }

    if (!keyword) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const results = this.categories.filter(p =>
      p.name.toLowerCase().includes(keyword)
    );

    if (results.length === 0) {
      this.notify.warning('No products match your search.');
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = results;
    }
    this.prepareCategoryTree();
  }


  prepareCategoryTree() {
    const mapToTree = (cats: any[]): TreeNode[] => {
      return cats.map(c => ({
        data: c,
        children: c.children ? mapToTree(c.children) : [],
        label: c.name,
        key: c._id
      }));
    };
    this.categoryTree = mapToTree(this.filteredCategories);
  }


  openForm() {

    this.selectedCategory = null;
    this.formTitle = 'Add Category';
    this.displayForm = true;


  }

  editCategory(category: any) {

    this.selectedCategory = category;
    this.formTitle = 'Edit Category';
    this.displayForm = true;


  }


  deleteCategory(event : Event , id: string) {

    this.confirmationMessage.confirm({
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

        this.categoryService.deleteCategory(id).subscribe({

          next: () => {

            this.notify.success('category deleted');
            this.filteredCategories = this.filteredCategories.filter(c => c._id !== id);
            this.loadCategories();

          }, error: err => {
            this.notify.error('failed to delete');
            console.error('Delete error', err);
          }
        });
      }
    })
  }

  onFormSaved(saved: boolean) {
    if (saved) {
      this.loadCategories();
      this.displayForm = false;
    }
  }


}


