import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { LoaderService } from './services/loader/loader-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('frontend');

  loading = false;

  constructor(private  loderService : LoaderService , private change : ChangeDetectorRef){
    this.loderService.isLoading.subscribe((res)=>{
      this.loading = res;
      this.change.detectChanges();
    })
  }

  ngOnInit() {
  this.loderService.show();
  setTimeout(() => this.loderService.hide(), 4000);
}

}
