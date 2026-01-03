import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product/product-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-section',
  standalone: false,
  templateUrl: './section.html',
  styleUrl: './section.css'
})
export class Section implements OnInit {

  environment = environment;

  sectionKey!: string;
  sectionTitle!: string;
  products: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.sectionKey = this.route.snapshot.paramMap.get('key')!;
    this.loadSectionProducts();
  }

  loadSectionProducts() {

    this.productService.getSections(20).subscribe({
      next: (res: any) => {
        const sectiondata = res[this.sectionKey];
        this.products = sectiondata || [];
        this.sectionTitle = this.titleForm(this.sectionKey);
      },
      error: (err) => console.error('section load error', err)
    })
  }


  titleForm(key: string): string {
    const titles: any = {
      deals: 'Deals of the Day',
      topProducts: 'Top Products for You',
      topElectronics: 'Top Electronics',
      topSpeakers: 'Top Deals on Speakers',
      topFashions: 'Fashions Top Deals',
      topToys: 'Kids Toys and More...',
      recommended: 'Recommended for You'
    };
    return titles[key] || 'Products';
  }

  viewProduct(peoductId: string) {
    this.router.navigate(['/product', peoductId]);
  }

}
