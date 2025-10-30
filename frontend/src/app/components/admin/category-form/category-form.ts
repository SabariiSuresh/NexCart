import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category-service';
import { TreeNode } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';

@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit, OnChanges {

  @Input() category: any = null;
  @Output() formSaved = new EventEmitter<boolean>();

  categoryForm!: FormGroup;
  treeCategories: any;

  constructor(private categoryservice: CategoryService, private form: FormBuilder, private notify: NotificationService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.initForm();
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && this.categoryForm) {
      this.categoryForm.patchValue({
        name: this.category?.name || '',
        description: this.category?.description || '',
        parent: this.category?.parent?._id || null,
        type : this.category?.type || ''
      });
    }
  }


  initForm() {
    this.categoryForm = this.form.group({
      name: [this.category?.name || '', Validators.required],
      description: [this.category?.description || '', Validators.required],
      parent: [this.category?.parent?._id || null],
      type : [this.category?.type || '' , Validators.required]
    });
  }



  loadCategories() {

    this.categoryservice.getCategories().subscribe(res => {
      this.treeCategories = this.buildTree(res.categories);

    });

  }


  buildTree(categories: any[]): TreeNode[] {
    return categories.map(cat => ({
      label: cat.name,
      key: cat._id,
      data: cat,
      children: cat.children ? this.buildTree(cat.children) : []
    }));
  }



  submitForm() {

    const formValue = {
      ...this.categoryForm.value
    }

    if (formValue.parent && typeof formValue.parent === 'object') {
      formValue.parent = formValue.parent.key || formValue.parent.data?._id || null;
      console.log('Trigger', formValue)
    }

    if (this.category && formValue.parent === this.category._id) {
      this.notify.success('Cannot set category as its own parent');
      return;
    }

    if (this.category) {

      this.categoryservice.updateCategory(this.category._id, formValue).subscribe({

        next: () => {
          this.notify.success('Category updated')

          this.formSaved.emit(true);

        }, error: err => {
          this.notify.error('Failed to updated Category');
          console.error('Update error', err);
        }
      })

    } else {

      this.categoryservice.createCategory(formValue).subscribe({

        next: () => {

          this.notify.success('Category added');

          this.formSaved.emit(true);

          this.categoryForm.reset();

        }, error: err => {
          this.notify.error('Failed to add Category');
          console.error('Create error', err);
        }
      })

    }

  }


}
