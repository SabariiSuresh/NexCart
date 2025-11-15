import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category/category-service';
import { TreeNode } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';
import { FileUpload } from 'primeng/fileupload';
@Component({
  selector: 'app-category-form',
  standalone: false,
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryForm implements OnInit, OnChanges {

  @Input() category: any = null;
  @Output() formSaved = new EventEmitter<boolean>();
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  categoryForm!: FormGroup;
  treeCategories: any;

  selectedFile: File | null = null;
  preview: string | ArrayBuffer | null = null;

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
        type: this.category?.type || ''
      });
    }
  }


  initForm() {
    this.categoryForm = this.form.group({
      name: [this.category?.name || '', Validators.required],
      description: [this.category?.description || '', Validators.required],
      parent: [this.category?.parent?._id || null],
      type: [this.category?.type || '', Validators.required]
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

    const payload = { ...this.categoryForm.value };

    if (payload.parent) {
      if (typeof payload.parent === "object") {
        payload.parent = payload.parent.key || payload.parent._id || null;
      } else {
        payload.parent = String(payload.parent);
      }
    } else {
      payload.parent = null;
    }

    const formValue = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formValue.append(key, value !== null && value !== undefined ? String(value) : "");
    });


    if (this.selectedFile !== null) {
      formValue.append('image', this.selectedFile);
    }


    if (this.category && payload.parent === this.category._id) {
      this.notify.error('Cannot set category as its own parent');
      return;
    }


    if (this.category) {
      this.categoryservice.updateCategory(this.category._id, formValue).subscribe({
        next: () => {
          this.notify.success('Category updated');
          this.formSaved.emit(true);
          this.resetForm();
        },
        error: err => {
          this.notify.error('Failed to update category');
          console.error('Update error', err);
        }
      });

    } else {

      this.categoryservice.createCategory(formValue).subscribe({
        next: () => {
          this.notify.success('Category added');
          this.formSaved.emit(true);
          this.resetForm();
        },
        error: err => {
          this.notify.error('Failed to add category');
          console.error('Create error', err);
        }
      });
    }
  }


  resetForm() {
    this.categoryForm.reset();
    this.selectedFile = null;
    this.preview = null;

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }



  onFileSelected(event: any) {
    const file = event.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result);
    reader.readAsDataURL(file);
  }

}
