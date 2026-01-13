import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product-service';
import { CategoryService } from '../../../services/category/category-service';
import { TreeNode } from 'primeng/api';
import { NotificationService } from '../../../services/notification/notification-service';
import { Feature } from '../../../services/feature-grouping/feature';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductForm implements OnInit, OnChanges {

  @Input() product: any = null;
  @Output() formSaved = new EventEmitter<boolean>();

  productForm!: FormGroup;
  productTrees: TreeNode[] = [];
  maxImages = 5;

  categoryIdMap: Record<string, string> = {};

  multiSelectKeys = ['ram', 'internal', 'charging type'];


  constructor(
    private form: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private notify: NotificationService,
    private cd: ChangeDetectorRef,
    private featureService: Feature
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();

    this.productForm.get('price')?.valueChanges.subscribe(() => this.calculateDiscount());
    this.productForm.get('oldPrice')?.valueChanges.subscribe(() => this.calculateDiscount());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.productForm) return;

    if (changes['product'] && this.product) {
      this.patchProduct();
    } else if (!this.product) {
      this.resetForm();
    }
  }


  private initForm() {
    this.productForm = this.form.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      oldPrice: [''],
      discount: [{ value: 0, disabled: true }],
      stock: ['', Validators.required],
      category: [null, Validators.required],
      features: this.form.group({}),
      images: this.form.array([this.form.control({ file: null, preview: null })])
    });
  }


  private resetForm() {
    this.productForm.reset();
    this.productForm.setControl('images', this.form.array([this.form.control({ file: null, preview: null })]));
    this.productForm.setControl('features', this.form.group({}));
  }


  private patchProduct() {
    this.productForm.patchValue({
      name: this.product.name,
      description: this.product.description,
      brand: this.product.brand,
      price: this.product.price,
      stock: this.product.stock,
      oldPrice: this.product.oldPrice || 0
    });

    this.calculateDiscount();

    if (this.product.category?._id && this.categoryIdMap[this.product.category._id]) {
      const slug = this.categoryIdMap[this.product.category._id];
      this.setFeaturesByCategory(this.product.category._id, this.product.features);
    }

    if (this.product.images?.length) {
      const imageArray = this.product.images.map((img: string) =>
        this.form.control({ file: null, preview: img })
      );
      this.productForm.setControl('images', this.form.array(imageArray));
    }
  }


  private loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      const categories = res.categories;
      this.productTrees = this.buildTree(categories);


      this.buildCategoryIdMap(categories);


      if (this.product?.category?._id && this.categoryIdMap[this.product.category._id]) {
        this.setFeaturesByCategory(this.product.category._id, this.product.features);
      }
    });
  }


  private buildTree(categories: any[]): TreeNode[] {
    return categories.map(cat => ({
      label: cat.name,
      key: cat._id,
      data: cat,
      children: cat.children?.length ? this.buildTree(cat.children) : []
    }));
  }


  private buildCategoryIdMap(categories: any[]) {
    for (let cat of categories) {
      if (cat.type) this.categoryIdMap[cat._id] = cat.type;
      if (cat.children?.length) this.buildCategoryIdMap(cat.children);
    }
  }



  private setFeaturesByCategory(categoryId: string, productFeatures: any = {}) {

    const type = this.categoryIdMap[categoryId];
    if (!type) return;

    const categoryMap = this.featureService.getFeatureOptionsMap()[type] || {};
    const featuresGroup = this.form.group({});

    Object.keys(categoryMap).forEach(featureKey => {

      const options = this.getFeatureOptions(featureKey);
      let value = productFeatures?.[featureKey] ?? [];

      if (this.isBooleanFeature(featureKey)) {

        const normalized = value === true || value === 'Yes';
        featuresGroup.addControl(featureKey, this.form.control(normalized));

      } else if (options.length > 0 && this.isMultiSelectFeature(featureKey)) {

        const array = this.form.array(
          options.map(opt => Array.isArray(value) && value.includes(opt))
        );

        featuresGroup.addControl(featureKey, array);

      } else if (options.length > 0) {

        featuresGroup.addControl(featureKey, this.form.control(value ?? ''));

      }

    });

    Object.entries(productFeatures || {}).forEach(([key, value]) => {
      if (!featuresGroup.contains(key)) {
        if (this.isBooleanFeature(key)) value = value === true || value === 'Yes';
        featuresGroup.addControl(key, this.form.control(value));
      }
    });

    this.productForm.setControl('features', featuresGroup);
  }


  getFeatureOptions(key: string): string[] {
    const categoryType =
      this.categoryIdMap[this.productForm.value.category?.key];

    if (!categoryType) return [];

    return (
      this.featureService
        .getFeatureOptionsMap()[categoryType]?.[key] || []
    );
  }


  hasOptions(key: string): boolean {
    return this.getFeatureOptions(key).length > 0;
  }


  isBooleanFeature(key: string): boolean {
    const options = this.getFeatureOptions(key);
    return options.length === 2 &&
      options.includes('Yes') &&
      options.includes('No');
  }

  formatFeatureLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getFeatureDropdownOptions(key: string) {
    return this.getFeatureOptions(key).map(o => ({ label: o, value: o }));
  }

  isMultiSelectFeature(key: string): boolean {
    return this.multiSelectKeys.includes(key);
  }

  getFeatureArray(key: string): FormArray {
    return this.featuresGroup.get(key) as FormArray;
  }


  submitForm() {
    if (this.productForm.invalid) return;

    this.calculateDiscount();
    const formData = new FormData();
    const value = this.productForm.value;

    const featuresValue: Record<string, any> = {};

    Object.keys(this.featuresGroup.controls).forEach(key => {
      const ctrl = this.featuresGroup.get(key);

      if (!ctrl) return;

      if (ctrl instanceof FormArray) {
        const options = this.getFeatureOptions(key);

        featuresValue[key] = ctrl.value
          .map((checked: boolean, i: number) =>
            checked ? options[i] : null
          )
          .filter((v: string | null): v is string => v !== null);

      } else {
        featuresValue[key] = ctrl.value;
      }
    });

    formData.append('name', value.name);
    formData.append('description', value.description);
    formData.append('brand', value.brand);
    formData.append('price', value.price);
    formData.append('oldPrice', value.oldPrice || 0);
    formData.append('discount', String(Number(value.discount || 0)));
    formData.append('stock', value.stock);
    formData.append('features', JSON.stringify(featuresValue));

    const categoryId = value.category?.key;
    formData.append('category', categoryId);

    value.images.forEach((img: any) => {
      if (img.file) formData.append('images', img.file);
      else if (img.preview) formData.append('images', img.preview);
    });

    if (this.product) {
      this.productService.updateProduct(this.product._id, formData).subscribe({
        next: () => {
          this.notify.success('Product updated');
          this.formSaved.emit(true);
          this.productForm.reset();
        },
        error: () => this.notify.error('Failed to update product')
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.notify.success('Product added');
          this.formSaved.emit(true);
          this.productForm.reset();
        },
        error: err => this.notify.error('Failed to add product' + err)
      });
    }
  }


  get featuresGroup(): FormGroup {
    return this.productForm.get('features') as FormGroup;
  }


  get featureKeys(): string[] {
    return Object.keys(this.featuresGroup.controls);
  }

  addFeature(keyInput: HTMLInputElement, valueInput: HTMLInputElement) {
    const key = keyInput.value.trim();
    let value: string | boolean = valueInput.value.trim();
    if (!key || !value) return;

    if (this.isBooleanFeature(key)) {
      value = value === 'Yes' ? true : false;;
    }

    if (!this.featuresGroup.contains(key)) {
      this.featuresGroup.addControl(key, this.form.control(value));
      this.cd.detectChanges();
      keyInput.value = '';
      valueInput.value = '';
    }
  }

  removeFeature(key: string) {
    if (this.featuresGroup.contains(key)) {
      this.featuresGroup.removeControl(key);
    }
  }


  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  addImage() {
    this.images.push(this.form.control({ file: null, preview: null }));
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.images.at(index).setValue({ file, preview: reader.result });
      if (index === this.images.length - 1 && this.images.length < this.maxImages) this.addImage();
    };
    reader.readAsDataURL(file);
  }

  onCategoryChange(categoryId?: string) {
    if (!categoryId) return;
    this.setFeaturesByCategory(categoryId);
  }

  calculateDiscount() {
    const price = Number(this.productForm.value.price);
    const oldPrice = Number(this.productForm.value.oldPrice);

    if (oldPrice && oldPrice > price) {
      const discount = Math.round(((oldPrice - price) / oldPrice) * 100);
      this.productForm.get('discount')?.setValue(discount);
    } else {
      this.productForm.get('discount')?.setValue(0);
    }
  }
}
